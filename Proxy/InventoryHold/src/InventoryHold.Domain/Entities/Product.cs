namespace InventoryHold.Domain.Entities;

public sealed class Product
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public int QuantityAvailable { get; set; }
}
