namespace InventoryHold.Domain;

public sealed class HoldOptions
{
    public const string SectionName = "Hold";
    public int DefaultDurationMinutes { get; set; } = 15;
}
