using InventoryHold.Domain.Entities;

namespace InventoryHold.Domain.Repositories;

public interface IProductRepository
{
    Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Product?> GetByIdAsync(string productId, CancellationToken cancellationToken = default);
    /// <summary>Atomically decreases quantity if enough stock. Returns false if insufficient or missing.</summary>
    Task<bool> TryDecrementStockAsync(string productId, int quantity, CancellationToken cancellationToken = default);
    /// <summary>Atomically increases quantity for a product.</summary>
    Task IncrementStockAsync(string productId, int quantity, CancellationToken cancellationToken = default);
}
