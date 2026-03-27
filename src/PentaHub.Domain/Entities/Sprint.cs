using PentaHub.Domain.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Entities;

public class Sprint : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public SprintState State { get; set; } = SprintState.Draft;
    public string? Goal { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
