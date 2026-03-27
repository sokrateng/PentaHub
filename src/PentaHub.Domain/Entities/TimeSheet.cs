using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class TimeSheet : BaseEntity
{
    public int UserId { get; set; }
    public int TaskId { get; set; }
    public DateTime Date { get; set; }
    public decimal Hours { get; set; }
    public string? Description { get; set; }
    public bool IsBillable { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public ProjectTask Task { get; set; } = null!;
}
