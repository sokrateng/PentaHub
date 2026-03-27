using PentaHub.Domain.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Entities;

public class TaskDependency : BaseEntity
{
    public int TaskId { get; set; }
    public int DependsOnTaskId { get; set; }
    public DependencyType DependencyType { get; set; } = DependencyType.FinishToStart;

    // Navigation
    public ProjectTask Task { get; set; } = null!;
    public ProjectTask DependsOnTask { get; set; } = null!;
}
