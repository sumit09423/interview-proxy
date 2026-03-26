using System.Text;
using System.Text.Json;
using InventoryHold.Contracts;
using InventoryHold.Domain.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace InventoryHold.Infrastructure.Rabbit;

public sealed class RabbitMqEventPublisher : IIntegrationEventPublisher, IDisposable
{
    private readonly RabbitMqOptions _options;
    private readonly ILogger<RabbitMqEventPublisher> _logger;
    private readonly object _sync = new();
    private IConnection? _connection;
    private IModel? _channel;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public RabbitMqEventPublisher(IOptions<RabbitMqOptions> options, ILogger<RabbitMqEventPublisher> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    private void EnsureChannel()
    {
        if (_channel is { IsOpen: true }) return;
        _channel?.Dispose();
        _connection?.Dispose();
        var factory = new ConnectionFactory
        {
            HostName = _options.HostName,
            Port = _options.Port,
            UserName = _options.UserName,
            Password = _options.Password,
            VirtualHost = string.IsNullOrEmpty(_options.VirtualHost) ? "/" : _options.VirtualHost
        };
        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        _channel.ExchangeDeclare(_options.ExchangeName, ExchangeType.Topic, durable: true);
    }

    private Task PublishAsync(string routingKey, object payload, CancellationToken cancellationToken)
    {
        try
        {
            lock (_sync)
            {
                EnsureChannel();
                if (_channel is null) return Task.CompletedTask;
                var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload, JsonOptions));
                var props = _channel.CreateBasicProperties();
                props.ContentType = "application/json";
                props.DeliveryMode = 2;
                _channel.BasicPublish(_options.ExchangeName, routingKey, props, body);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to publish RabbitMQ message {RoutingKey}", routingKey);
        }
        return Task.CompletedTask;
    }

    public Task PublishHoldCreatedAsync(HoldCreatedEvent evt, CancellationToken cancellationToken = default) =>
        PublishAsync("hold.created", evt, cancellationToken);

    public Task PublishHoldReleasedAsync(HoldReleasedEvent evt, CancellationToken cancellationToken = default) =>
        PublishAsync("hold.released", evt, cancellationToken);

    public Task PublishHoldExpiredAsync(HoldExpiredEvent evt, CancellationToken cancellationToken = default) =>
        PublishAsync("hold.expired", evt, cancellationToken);

    public void Dispose()
    {
        lock (_sync)
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
}
