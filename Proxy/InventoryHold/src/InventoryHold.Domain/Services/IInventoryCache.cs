using InventoryHold.Domain.Entities;

namespace InventoryHold.Domain.Services;

public interface IInventoryCache
{
    Task<IReadOnlyList<Product>?> GetInventoryListAsync(CancellationToken cancellationToken = default);
    Task SetInventoryListAsync(IReadOnlyList<Product> products, CancellationToken cancellationToken = default);
    Task InvalidateInventoryAsync(CancellationToken cancellationToken = default);
    Task<Hold?> GetHoldAsync(string holdId, CancellationToken cancellationToken = default);
    Task SetHoldAsync(Hold hold, CancellationToken cancellationToken = default);
    Task InvalidateHoldAsync(string holdId, CancellationToken cancellationToken = default);
}
