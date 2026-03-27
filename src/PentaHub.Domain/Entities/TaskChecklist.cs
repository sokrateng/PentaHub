using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class TaskChecklist : BaseEntity
{
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int? AssigneeId { get; set; }
    public bool IsCompleted { get; set; }
    public int SortOrder { get; set; }

    // Navigation
    public ProjectTask Task { get; set; } = null!;
    public User? Assignee { get; set; }
}
