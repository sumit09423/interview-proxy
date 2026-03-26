using InventoryHold.Contracts;
using InventoryHold.Domain;
using InventoryHold.Domain.Entities;
using InventoryHold.Domain.Repositories;
using InventoryHold.Domain.Services;
using Microsoft.Extensions.Options;
using Moq;

namespace InventoryHold.UnitTests;

[TestFixture]
public sealed class HoldApplicationServiceTests
{
    private Mock<IProductRepository> _products = null!;
    private Mock<IHoldRepository> _holds = null!;
    private Mock<IInventoryCache> _cache = null!;
    private Mock<IIntegrationEventPublisher> _publisher = null!;
    private HoldOptions _holdOptions = null!;

    [SetUp]
    public void SetUp()
    {
        _products = new Mock<IProductRepository>();
        _holds = new Mock<IHoldRepository>();
        _cache = new Mock<IInventoryCache>();
        _publisher = new Mock<IIntegrationEventPublisher>();
        _holdOptions = new HoldOptions { DefaultDurationMinutes = 15 };
    }

    private HoldApplicationService Sut() => new(
        _products.Object,
        _holds.Object,
        _cache.Object,
        _publisher.Object,
        Options.Create(_holdOptions));

    [Test]
    public async Task CreateHoldAsync_WhenItemsEmpty_ReturnsValidationError()
    {
        var sut = Sut();
        var (dto, err) = await sut.CreateHoldAsync(new CreateHoldRequestDto(Array.Empty<CreateHoldLineRequestDto>()));
        Assert.That(dto, Is.Null);
        Assert.That(err, Is.Not.Null);
        Assert.That(err!.Code, Is.EqualTo("validation_error"));
    }

    [Test]
    public async Task CreateHoldAsync_WhenStockInsufficient_RevertsPriorDecrements()
    {
        _products.Setup(p => p.GetByIdAsync("a", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Product { Id = "a", Name = "A", QuantityAvailable = 10 });
        _products.Setup(p => p.GetByIdAsync("b", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Product { Id = "b", Name = "B", QuantityAvailable = 10 });
        _products.Setup(p => p.TryDecrementStockAsync("a", 1, It.IsAny<CancellationToken>())).ReturnsAsync(true);
        _products.Setup(p => p.TryDecrementStockAsync("b", 999, It.IsAny<CancellationToken>())).ReturnsAsync(false);

        var sut = Sut();
        var req = new CreateHoldRequestDto(new[] { new CreateHoldLineRequestDto("a", 1), new CreateHoldLineRequestDto("b", 999) });
        var (dto, err) = await sut.CreateHoldAsync(req);

        Assert.That(dto, Is.Null);
        Assert.That(err!.Code, Is.EqualTo("insufficient_stock"));
        _products.Verify(p => p.IncrementStockAsync("a", 1, It.IsAny<CancellationToken>()), Times.Once);
        _holds.Verify(h => h.CreateAsync(It.IsAny<Hold>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task CreateHoldAsync_WhenSuccessful_CreatesHoldAndPublishesEvent()
    {
        _products.Setup(p => p.GetByIdAsync("sku-001", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new Product { Id = "sku-001", Name = "Mouse", QuantityAvailable = 5 });
        _products.Setup(p => p.TryDecrementStockAsync("sku-001", 2, It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var sut = Sut();
        var req = new CreateHoldRequestDto(new[] { new CreateHoldLineRequestDto("sku-001", 2) });
        var (dto, err) = await sut.CreateHoldAsync(req);

        Assert.That(err, Is.Null);
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto!.Items, Has.Count.EqualTo(1));
        _holds.Verify(h => h.CreateAsync(It.IsAny<Hold>(), It.IsAny<CancellationToken>()), Times.Once);
        _cache.Verify(c => c.InvalidateInventoryAsync(It.IsAny<CancellationToken>()), Times.Once);
        _publisher.Verify(p => p.PublishHoldCreatedAsync(It.IsAny<HoldCreatedEvent>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task GetHoldAsync_WhenMissing_ReturnsNotFound()
    {
        _holds.Setup(h => h.GetByIdAsync("nope", It.IsAny<CancellationToken>())).ReturnsAsync((Hold?)null);
        _cache.Setup(c => c.GetHoldAsync("nope", It.IsAny<CancellationToken>())).ReturnsAsync((Hold?)null);

        var sut = Sut();
        var (dto, err) = await sut.GetHoldAsync("nope");
        Assert.That(dto, Is.Null);
        Assert.That(err!.Code, Is.EqualTo("not_found"));
    }

    [Test]
    public async Task ReleaseHoldAsync_WhenAlreadyReleased_ReturnsConflict()
    {
        var hold = new Hold
        {
            Id = "h1",
            Items = new List<HoldLine>(),
            Status = HoldStatus.Released,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
            CreatedAt = DateTimeOffset.UtcNow,
            ExpiredEventPublished = false
        };
        _holds.Setup(h => h.GetByIdAsync("h1", It.IsAny<CancellationToken>())).ReturnsAsync(hold);

        var sut = Sut();
        var (ok, err) = await sut.ReleaseHoldAsync("h1");
        Assert.That(ok, Is.False);
        Assert.That(err!.Code, Is.EqualTo("conflict"));
    }

    [Test]
    public async Task ReleaseHoldAsync_WhenTryMarkReleasedFails_ReturnsConflict()
    {
        var hold = new Hold
        {
            Id = "h1",
            Items = new List<HoldLine> { new() { ProductId = "p", ProductName = "P", Quantity = 1 } },
            Status = HoldStatus.Active,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(10),
            CreatedAt = DateTimeOffset.UtcNow,
            ExpiredEventPublished = false
        };
        _holds.Setup(h => h.GetByIdAsync("h1", It.IsAny<CancellationToken>())).ReturnsAsync(hold);
        _holds.Setup(h => h.TryMarkReleasedAsync("h1", It.IsAny<CancellationToken>())).ReturnsAsync(false);

        var sut = Sut();
        var (ok, err) = await sut.ReleaseHoldAsync("h1");
        Assert.That(ok, Is.False);
        Assert.That(err!.Code, Is.EqualTo("conflict"));
        _products.Verify(p => p.IncrementStockAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Test]
    public async Task GetHoldAsync_WhenExpired_RestoresStockAndPublishesExpiredEvent()
    {
        var hold = new Hold
        {
            Id = "h-exp",
            Items = new List<HoldLine> { new() { ProductId = "sku-001", ProductName = "Mouse", Quantity = 2 } },
            Status = HoldStatus.Active,
            ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-1),
            CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-10),
            ExpiredEventPublished = false
        };

        _cache.Setup(c => c.GetHoldAsync("h-exp", It.IsAny<CancellationToken>())).ReturnsAsync((Hold?)null);
        _holds.Setup(h => h.GetByIdAsync("h-exp", It.IsAny<CancellationToken>())).ReturnsAsync(hold);
        _holds.Setup(h => h.TryMarkExpiredAsync("h-exp", It.IsAny<CancellationToken>())).ReturnsAsync(true);

        var sut = Sut();
        var (dto, err) = await sut.GetHoldAsync("h-exp");

        Assert.That(err, Is.Null);
        Assert.That(dto, Is.Not.Null);
        Assert.That(dto!.Status, Is.EqualTo(HoldStatusDto.Expired));
        _products.Verify(p => p.IncrementStockAsync("sku-001", 2, It.IsAny<CancellationToken>()), Times.Once);
        _publisher.Verify(p => p.PublishHoldExpiredAsync(It.IsAny<HoldExpiredEvent>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
