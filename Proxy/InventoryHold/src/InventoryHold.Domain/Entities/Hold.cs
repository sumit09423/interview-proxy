namespace InventoryHold.Domain.Entities;

public sealed class Hold
{
    public required string Id { get; init; }
    public required List<HoldLine> Items { get; init; }
    public HoldStatus Status { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public DateTimeOffset CreatedAt { get; init; }
    public bool ExpiredEventPublished { get; set; }
}

public sealed class HoldLine
{
    public required string ProductId { get; init; }
    public required string ProductName { get; init; }
    public int Quantity { get; init; }
}
