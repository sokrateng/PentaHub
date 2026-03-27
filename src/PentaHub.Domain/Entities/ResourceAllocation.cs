using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class ResourceAllocation : BaseEntity
{
    public int UserId { get; set; }
    public int ProjectId { get; set; }
    public int? TaskId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal HoursPerDay { get; set; }
    public decimal TotalHours { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Project Project { get; set; } = null!;
    public ProjectTask? Task { get; set; }
}
