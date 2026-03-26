namespace InventoryHold.Contracts;

public sealed record InventoryItemDto(string ProductId, string Name, int QuantityAvailable);
