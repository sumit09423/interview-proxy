using InventoryHold.Domain.Entities;

namespace InventoryHold.Domain.Repositories;

public interface IHoldRepository
{
    Task CreateAsync(Hold hold, CancellationToken cancellationToken = default);
    Task<Hold?> GetByIdAsync(string holdId, CancellationToken cancellationToken = default);
    Task<bool> TryMarkReleasedAsync(string holdId, CancellationToken cancellationToken = default);
    Task<bool> TryMarkExpiredAsync(string holdId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Hold>> GetActiveHoldsAsync(CancellationToken cancellationToken = default);
}
