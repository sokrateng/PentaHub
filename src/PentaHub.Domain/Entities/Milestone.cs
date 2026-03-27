using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class Milestone : BaseEntity
{
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? TargetDate { get; set; }
    public int SortOrder { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
