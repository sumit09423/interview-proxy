namespace InventoryHold.Infrastructure.Redis;

public sealed class RedisOptions
{
    public const string SectionName = "Redis";
    public string ConnectionString { get; set; } = "localhost:6379";
    public int InventoryListTtlSeconds { get; set; } = 60;
    public int HoldTtlSeconds { get; set; } = 120;
}
