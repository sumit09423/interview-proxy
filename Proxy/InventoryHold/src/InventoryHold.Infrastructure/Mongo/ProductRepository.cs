using InventoryHold.Domain.Entities;
using InventoryHold.Domain.Repositories;
using MongoDB.Driver;

namespace InventoryHold.Infrastructure.Mongo;

public sealed class ProductRepository : IProductRepository
{
    private readonly IMongoCollection<ProductDocument> _collection;

    public ProductRepository(MongoContext ctx)
    {
        _collection = ctx.Database.GetCollection<ProductDocument>("products");
    }

    public async Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var docs = await _collection.Find(FilterDefinition<ProductDocument>.Empty).ToListAsync(cancellationToken);
        return docs.Select(d => d.ToDomain()).ToList();
    }

    public async Task<Product?> GetByIdAsync(string productId, CancellationToken cancellationToken = default)
    {
        var doc = await _collection.Find(x => x.Id == productId).FirstOrDefaultAsync(cancellationToken);
        return doc?.ToDomain();
    }

    public async Task<bool> TryDecrementStockAsync(string productId, int quantity, CancellationToken cancellationToken = default)
    {
        var filter = Builders<ProductDocument>.Filter.And(
            Builders<ProductDocument>.Filter.Eq(x => x.Id, productId),
            Builders<ProductDocument>.Filter.Gte(x => x.QuantityAvailable, quantity));
        var update = Builders<ProductDocument>.Update.Inc(x => x.QuantityAvailable, -quantity);
        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task IncrementStockAsync(string productId, int quantity, CancellationToken cancellationToken = default)
    {
        var filter = Builders<ProductDocument>.Filter.Eq(x => x.Id, productId);
        var update = Builders<ProductDocument>.Update.Inc(x => x.QuantityAvailable, quantity);
        await _collection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
    }
}

internal sealed class ProductDocument
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public int QuantityAvailable { get; set; }

    public Product ToDomain() => new() { Id = Id, Name = Name, QuantityAvailable = QuantityAvailable };
}
