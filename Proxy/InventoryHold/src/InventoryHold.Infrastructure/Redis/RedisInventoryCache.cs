using System.Text.Json;
using InventoryHold.Domain.Entities;
using InventoryHold.Domain.Services;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace InventoryHold.Infrastructure.Redis;

public sealed class RedisInventoryCache : IInventoryCache
{
    private const string InventoryKey = "inventory:list";
    private static string HoldKey(string id) => $"hold:{id}";

    private readonly IDatabase _db;
    private readonly RedisOptions _options;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public RedisInventoryCache(IConnectionMultiplexer mux, IOptions<RedisOptions> options)
    {
        _db = mux.GetDatabase();
        _options = options.Value;
    }

    public async Task<IReadOnlyList<Product>?> GetInventoryListAsync(CancellationToken cancellationToken = default)
    {
        var val = await _db.StringGetAsync(InventoryKey).ConfigureAwait(false);
        if (val.IsNullOrEmpty) return null;
        return JsonSerializer.Deserialize<List<ProductCacheDto>>(val.ToString()!, JsonOptions)?.Select(x => x.ToDomain()).ToList();
    }

    public async Task SetInventoryListAsync(IReadOnlyList<Product> products, CancellationToken cancellationToken = default)
    {
        var dto = products.Select(ProductCacheDto.FromDomain).ToList();
        var json = JsonSerializer.Serialize(dto, JsonOptions);
        await _db.StringSetAsync(InventoryKey, json, TimeSpan.FromSeconds(_options.InventoryListTtlSeconds)).ConfigureAwait(false);
    }

    public Task InvalidateInventoryAsync(CancellationToken cancellationToken = default) =>
        _db.KeyDeleteAsync(InventoryKey);

    public async Task<Hold?> GetHoldAsync(string holdId, CancellationToken cancellationToken = default)
    {
        var val = await _db.StringGetAsync(HoldKey(holdId)).ConfigureAwait(false);
        if (val.IsNullOrEmpty) return null;
        return JsonSerializer.Deserialize<HoldCacheDto>(val.ToString()!, JsonOptions)?.ToDomain();
    }

    public async Task SetHoldAsync(Hold hold, CancellationToken cancellationToken = default)
    {
        var dto = HoldCacheDto.FromDomain(hold);
        var json = JsonSerializer.Serialize(dto, JsonOptions);
        await _db.StringSetAsync(HoldKey(hold.Id), json, TimeSpan.FromSeconds(_options.HoldTtlSeconds)).ConfigureAwait(false);
    }

    public Task InvalidateHoldAsync(string holdId, CancellationToken cancellationToken = default) =>
        _db.KeyDeleteAsync(HoldKey(holdId));
}

internal sealed class ProductCacheDto
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public int QuantityAvailable { get; set; }

    public static ProductCacheDto FromDomain(Product p) => new() { Id = p.Id, Name = p.Name, QuantityAvailable = p.QuantityAvailable };
    public Product ToDomain() => new() { Id = Id, Name = Name, QuantityAvailable = QuantityAvailable };
}

internal sealed class HoldCacheDto
{
    public string Id { get; set; } = "";
    public List<HoldLineCacheDto> Items { get; set; } = [];
    public string Status { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public bool ExpiredEventPublished { get; set; }

    public static HoldCacheDto FromDomain(Hold h) => new()
    {
        Id = h.Id,
        Items = h.Items.Select(i => new HoldLineCacheDto { ProductId = i.ProductId, ProductName = i.ProductName, Quantity = i.Quantity }).ToList(),
        Status = h.Status.ToString(),
        ExpiresAt = h.ExpiresAt,
        CreatedAt = h.CreatedAt,
        ExpiredEventPublished = h.ExpiredEventPublished
    };

    public Hold ToDomain() => new()
    {
        Id = Id,
        Items = Items.Select(i => new HoldLine { ProductId = i.ProductId, ProductName = i.ProductName, Quantity = i.Quantity }).ToList(),
        Status = Enum.Parse<HoldStatus>(Status),
        ExpiresAt = ExpiresAt,
        CreatedAt = CreatedAt,
        ExpiredEventPublished = ExpiredEventPublished
    };
}

internal sealed class HoldLineCacheDto
{
    public string ProductId { get; set; } = "";
    public string ProductName { get; set; } = "";
    public int Quantity { get; set; }
}
