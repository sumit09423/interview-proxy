using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace InventoryHold.Infrastructure.Mongo;

public sealed class InventoryDataSeeder : IHostedService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<InventoryDataSeeder> _logger;

    public InventoryDataSeeder(IServiceProvider services, ILogger<InventoryDataSeeder> logger)
    {
        _services = services;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _services.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<MongoContext>();
            var col = ctx.Database.GetCollection<ProductDocument>("products");
            var count = await col.CountDocumentsAsync(FilterDefinition<ProductDocument>.Empty, cancellationToken: cancellationToken);
            if (count > 0) return;

            var seed = new[]
            {
                new ProductDocument { Id = "sku-001", Name = "Wireless Mouse", QuantityAvailable = 100 },
                new ProductDocument { Id = "sku-002", Name = "USB-C Hub", QuantityAvailable = 50 },
                new ProductDocument { Id = "sku-003", Name = "Mechanical Keyboard", QuantityAvailable = 30 },
                new ProductDocument { Id = "sku-004", Name = "Monitor Stand", QuantityAvailable = 75 },
                new ProductDocument { Id = "sku-005", Name = "Webcam HD", QuantityAvailable = 40 },
                new ProductDocument { Id = "sku-006", Name = "Laptop Sleeve", QuantityAvailable = 120 }
            };
            await col.InsertManyAsync(seed, cancellationToken: cancellationToken);
            _logger.LogInformation("Seeded {Count} products.", seed.Length);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex,
                "Could not reach MongoDB to seed products. Start MongoDB on the port in Mongo:ConnectionString " +
                "(e.g. brew services start mongodb-community, or docker compose up mongodb), then restart the API.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
