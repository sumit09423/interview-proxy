namespace InventoryHold.Contracts;

public sealed record CreateHoldLineRequestDto(string ProductId, int Quantity);

public sealed record CreateHoldRequestDto(
    IReadOnlyList<CreateHoldLineRequestDto> Items,
    int? HoldDurationMinutes = null);
