using InventoryHold.Contracts;

namespace InventoryHold.Domain.Services;

public interface IIntegrationEventPublisher
{
    Task PublishHoldCreatedAsync(HoldCreatedEvent evt, CancellationToken cancellationToken = default);
    Task PublishHoldReleasedAsync(HoldReleasedEvent evt, CancellationToken cancellationToken = default);
    Task PublishHoldExpiredAsync(HoldExpiredEvent evt, CancellationToken cancellationToken = default);
}
