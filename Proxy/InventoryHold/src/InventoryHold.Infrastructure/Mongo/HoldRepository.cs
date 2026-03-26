using InventoryHold.Domain.Entities;
using InventoryHold.Domain.Repositories;
using MongoDB.Driver;

namespace InventoryHold.Infrastructure.Mongo;

public sealed class HoldRepository : IHoldRepository
{
    private readonly IMongoCollection<HoldDocument> _collection;

    public HoldRepository(MongoContext ctx)
    {
        _collection = ctx.Database.GetCollection<HoldDocument>("holds");
    }

    public Task CreateAsync(Hold hold, CancellationToken cancellationToken = default)
    {
        var doc = HoldDocument.FromDomain(hold);
        return _collection.InsertOneAsync(doc, cancellationToken: cancellationToken);
    }

    public async Task<Hold?> GetByIdAsync(string holdId, CancellationToken cancellationToken = default)
    {
        var doc = await _collection.Find(x => x.Id == holdId).FirstOrDefaultAsync(cancellationToken);
        return doc?.ToDomain();
    }

    public async Task<bool> TryMarkReleasedAsync(string holdId, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var filter = Builders<HoldDocument>.Filter.And(
            Builders<HoldDocument>.Filter.Eq(x => x.Id, holdId),
            Builders<HoldDocument>.Filter.Eq(x => x.Status, HoldStatus.Active.ToString()),
            Builders<HoldDocument>.Filter.Gt(x => x.ExpiresAt, now));
        var update = Builders<HoldDocument>.Update.Set(x => x.Status, HoldStatus.Released.ToString());
        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<bool> TryMarkExpiredAsync(string holdId, CancellationToken cancellationToken = default)
    {
        var filter = Builders<HoldDocument>.Filter.And(
            Builders<HoldDocument>.Filter.Eq(x => x.Id, holdId),
            Builders<HoldDocument>.Filter.Eq(x => x.Status, HoldStatus.Active.ToString()),
            Builders<HoldDocument>.Filter.Eq(x => x.ExpiredEventPublished, false));
        var update = Builders<HoldDocument>.Update
            .Set(x => x.ExpiredEventPublished, true)
            .Set(x => x.Status, HoldStatus.Expired.ToString());
        var result = await _collection.UpdateOneAsync(filter, update, cancellationToken: cancellationToken);
        return result.ModifiedCount == 1;
    }

    public async Task<IReadOnlyList<Hold>> GetActiveHoldsAsync(CancellationToken cancellationToken = default)
    {
        var filter = Builders<HoldDocument>.Filter.Eq(x => x.Status, HoldStatus.Active.ToString());
        var docs = await _collection.Find(filter).ToListAsync(cancellationToken);
        return docs.Select(d => d.ToDomain()).ToList();
    }
}

internal sealed class HoldDocument
{
    public string Id { get; set; } = "";
    public List<HoldLineDocument> Items { get; set; } = [];
    public string Status { get; set; } = "";
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public bool ExpiredEventPublished { get; set; }

    public static HoldDocument FromDomain(Hold h) => new()
    {
        Id = h.Id,
        Items = h.Items.Select(i => new HoldLineDocument { ProductId = i.ProductId, ProductName = i.ProductName, Quantity = i.Quantity }).ToList(),
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

internal sealed class HoldLineDocument
{
    public string ProductId { get; set; } = "";
    public string ProductName { get; set; } = "";
    public int Quantity { get; set; }
}
