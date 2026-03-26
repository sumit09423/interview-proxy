namespace InventoryHold.Contracts;

public sealed record HoldLineEventDto(string ProductId, string ProductName, int Quantity);

public sealed record HoldCreatedEvent(
    string EventType,
    string HoldId,
    DateTimeOffset OccurredAt,
    IReadOnlyList<HoldLineEventDto> Items,
    DateTimeOffset ExpiresAt);

public sealed record HoldReleasedEvent(
    string EventType,
    string HoldId,
    DateTimeOffset OccurredAt,
    IReadOnlyList<HoldLineEventDto> Items);

public sealed record HoldExpiredEvent(
    string EventType,
    string HoldId,
    DateTimeOffset OccurredAt,
    IReadOnlyList<HoldLineEventDto> Items,
    DateTimeOffset ExpiredAt);
