namespace InventoryHold.Contracts;

public sealed record HoldLineDto(string ProductId, string ProductName, int Quantity);
