namespace InventoryHold.Contracts;

public sealed record HoldResponseDto(
    string HoldId,
    HoldStatusDto Status,
    IReadOnlyList<HoldLineDto> Items,
    DateTimeOffset ExpiresAt,
    DateTimeOffset CreatedAt);
