using InventoryHold.Contracts;
using InventoryHold.Domain.Entities;
using InventoryHold.Domain.Repositories;
using Microsoft.Extensions.Options;

namespace InventoryHold.Domain.Services;

public sealed class HoldApplicationService
{
    private readonly IProductRepository _products;
    private readonly IHoldRepository _holds;
    private readonly IInventoryCache _cache;
    private readonly IIntegrationEventPublisher _publisher;
    private readonly HoldOptions _holdOptions;

    public HoldApplicationService(
        IProductRepository products,
        IHoldRepository holds,
        IInventoryCache cache,
        IIntegrationEventPublisher publisher,
        IOptions<HoldOptions> holdOptions)
    {
        _products = products;
        _holds = holds;
        _cache = cache;
        _publisher = publisher;
        _holdOptions = holdOptions.Value;
    }

    public async Task<(HoldResponseDto? dto, HoldServiceError? error)> CreateHoldAsync(
        CreateHoldRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.Items is null || request.Items.Count == 0)
            return (null, HoldServiceError.Validation("At least one line item is required."));

        foreach (var line in request.Items)
        {
            if (string.IsNullOrWhiteSpace(line.ProductId))
                return (null, HoldServiceError.Validation("ProductId is required for each line."));
            if (line.Quantity <= 0)
                return (null, HoldServiceError.Validation("Quantity must be greater than zero."));
        }

        var durationMinutes = request.HoldDurationMinutes ?? _holdOptions.DefaultDurationMinutes;
        if (durationMinutes <= 0 || durationMinutes > 24 * 60)
            return (null, HoldServiceError.Validation("Hold duration must be between 1 and 1440 minutes."));

        var resolvedLines = new List<HoldLine>();
        foreach (var line in request.Items)
        {
            var product = await _products.GetByIdAsync(line.ProductId, cancellationToken);
            if (product is null)
                return (null, HoldServiceError.Validation($"Unknown product '{line.ProductId}'."));
            resolvedLines.Add(new HoldLine
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = line.Quantity
            });
        }

        foreach (var line in resolvedLines)
        {
            var ok = await _products.TryDecrementStockAsync(line.ProductId, line.Quantity, cancellationToken);
            if (!ok)
            {
                foreach (var rev in resolvedLines)
                {
                    if (rev == line) break;
                    await _products.IncrementStockAsync(rev.ProductId, rev.Quantity, cancellationToken);
                }
                return (null, HoldServiceError.InsufficientStock("Insufficient stock for one or more products."));
            }
        }

        var now = DateTimeOffset.UtcNow;
        var hold = new Hold
        {
            Id = Guid.NewGuid().ToString("N"),
            Items = resolvedLines,
            Status = HoldStatus.Active,
            ExpiresAt = now.AddMinutes(durationMinutes),
            CreatedAt = now,
            ExpiredEventPublished = false
        };

        await _holds.CreateAsync(hold, cancellationToken);
        await _cache.InvalidateInventoryAsync(cancellationToken);
        await _cache.SetHoldAsync(hold, cancellationToken);

        await _publisher.PublishHoldCreatedAsync(new HoldCreatedEvent(
            "HoldCreated",
            hold.Id,
            now,
            hold.Items.Select(i => new HoldLineEventDto(i.ProductId, i.ProductName, i.Quantity)).ToList(),
            hold.ExpiresAt), cancellationToken);

        return (MapHold(hold), null);
    }

    public async Task<(HoldResponseDto? dto, HoldServiceError? error)> GetHoldAsync(
        string holdId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(holdId))
            return (null, HoldServiceError.Validation("holdId is required."));

        var cached = await _cache.GetHoldAsync(holdId, cancellationToken);
        var hold = cached ?? await _holds.GetByIdAsync(holdId, cancellationToken);
        if (hold is null)
            return (null, HoldServiceError.NotFound());

        var now = DateTimeOffset.UtcNow;
        if (hold.Status == HoldStatus.Active && hold.ExpiresAt <= now)
        {
            await ExpireAndRestoreAsync(hold, now, cancellationToken);
        }

        return (MapHold(hold), null);
    }

    public async Task<(bool ok, HoldServiceError? error)> ReleaseHoldAsync(
        string holdId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(holdId))
            return (false, HoldServiceError.Validation("holdId is required."));

        var hold = await _holds.GetByIdAsync(holdId, cancellationToken);
        if (hold is null)
            return (false, HoldServiceError.NotFound());

        if (hold.Status == HoldStatus.Released)
            return (false, HoldServiceError.Conflict("Hold is already released."));

        var now = DateTimeOffset.UtcNow;
        if (hold.Status == HoldStatus.Active && hold.ExpiresAt <= now)
        {
            await ExpireAndRestoreAsync(hold, now, cancellationToken);
            return (false, HoldServiceError.Conflict("Hold has expired and cannot be released."));
        }

        if (hold.Status == HoldStatus.Expired)
            return (false, HoldServiceError.Conflict("Hold has expired and cannot be released."));

        var marked = await _holds.TryMarkReleasedAsync(holdId, cancellationToken);
        if (!marked)
            return (false, HoldServiceError.Conflict("Hold could not be released."));

        foreach (var line in hold.Items)
            await _products.IncrementStockAsync(line.ProductId, line.Quantity, cancellationToken);

        await _cache.InvalidateInventoryAsync(cancellationToken);
        await _cache.InvalidateHoldAsync(holdId, cancellationToken);

        await _publisher.PublishHoldReleasedAsync(new HoldReleasedEvent(
            "HoldReleased",
            hold.Id,
            DateTimeOffset.UtcNow,
            hold.Items.Select(i => new HoldLineEventDto(i.ProductId, i.ProductName, i.Quantity)).ToList()), cancellationToken);

        return (true, null);
    }

    public async Task<IReadOnlyList<HoldResponseDto>> ListHoldsAsync(CancellationToken cancellationToken = default)
    {
        var holds = await _holds.GetActiveHoldsAsync(cancellationToken);
        var result = new List<HoldResponseDto>();
        var now = DateTimeOffset.UtcNow;
        foreach (var hold in holds)
        {
            if (hold.Status == HoldStatus.Active && hold.ExpiresAt <= now)
            {
                await ExpireAndRestoreAsync(hold, now, cancellationToken);
                result.Add(MapHold(hold));
                continue;
            }
            if (hold.Status == HoldStatus.Active && hold.ExpiresAt > now)
                result.Add(MapHold(hold));
        }
        return result;
    }

    private async Task ExpireAndRestoreAsync(Hold hold, DateTimeOffset now, CancellationToken cancellationToken)
    {
        var newlyExpired = await _holds.TryMarkExpiredAsync(hold.Id, cancellationToken);
        hold.Status = HoldStatus.Expired;
        hold.ExpiredEventPublished = true;

        if (newlyExpired)
        {
            foreach (var line in hold.Items)
                await _products.IncrementStockAsync(line.ProductId, line.Quantity, cancellationToken);

            await _publisher.PublishHoldExpiredAsync(new HoldExpiredEvent(
                "HoldExpired",
                hold.Id,
                now,
                hold.Items.Select(i => new HoldLineEventDto(i.ProductId, i.ProductName, i.Quantity)).ToList(),
                hold.ExpiresAt), cancellationToken);
            await _cache.InvalidateInventoryAsync(cancellationToken);
        }

        await _cache.InvalidateHoldAsync(hold.Id, cancellationToken);
        await _cache.SetHoldAsync(hold, cancellationToken);
    }

    public async Task<IReadOnlyList<InventoryItemDto>> GetInventoryAsync(CancellationToken cancellationToken = default)
    {
        var cached = await _cache.GetInventoryListAsync(cancellationToken);
        if (cached is not null)
            return cached.Select(p => new InventoryItemDto(p.Id, p.Name, p.QuantityAvailable)).ToList();

        var products = await _products.GetAllAsync(cancellationToken);
        await _cache.SetInventoryListAsync(products, cancellationToken);
        return products.Select(p => new InventoryItemDto(p.Id, p.Name, p.QuantityAvailable)).ToList();
    }

    private static HoldResponseDto MapHold(Hold hold) =>
        new(
            hold.Id,
            hold.Status switch
            {
                HoldStatus.Active => HoldStatusDto.Active,
                HoldStatus.Released => HoldStatusDto.Released,
                HoldStatus.Expired => HoldStatusDto.Expired,
                _ => HoldStatusDto.Active
            },
            hold.Items.Select(i => new HoldLineDto(i.ProductId, i.ProductName, i.Quantity)).ToList(),
            hold.ExpiresAt,
            hold.CreatedAt);
}

public sealed record HoldServiceError(string Code, string Message)
{
    public static HoldServiceError Validation(string message) => new("validation_error", message);
    public static HoldServiceError NotFound() => new("not_found", "Hold not found.");
    public static HoldServiceError InsufficientStock(string message) => new("insufficient_stock", message);
    public static HoldServiceError Conflict(string message) => new("conflict", message);
}
