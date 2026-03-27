using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class TaskStage : BaseEntity
{
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsClosedStage { get; set; }
    public bool ShowInKanban { get; set; } = true;

    // Navigation
    public Project Project { get; set; } = null!;
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
