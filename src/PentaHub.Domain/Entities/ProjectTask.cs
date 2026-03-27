using PentaHub.Domain.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Entities;

public class ProjectTask : BaseEntity
{
    public string TaskNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public int StageId { get; set; }
    public int? AssigneeId { get; set; }
    public int? SprintId { get; set; }
    public int? MilestoneId { get; set; }
    public int? ParentTaskId { get; set; }
    public Priority Priority { get; set; } = Priority.None;
    public bool IsBillable { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public bool BusinessDaysOnly { get; set; } = true;
    public decimal PlannedHours { get; set; }
    public decimal SpentHours { get; set; }
    public decimal RemainingHours { get; set; }
    public int ProgressPercent { get; set; }
    public string? Tags { get; set; }
    public int SortOrder { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public TaskStage Stage { get; set; } = null!;
    public User? Assignee { get; set; }
    public Sprint? Sprint { get; set; }
    public ProjectTask? ParentTask { get; set; }
    public ICollection<ProjectTask> SubTasks { get; set; } = new List<ProjectTask>();
    public ICollection<TaskDependency> Dependencies { get; set; } = new List<TaskDependency>();
    public ICollection<TaskDependency> Dependents { get; set; } = new List<TaskDependency>();
    public ICollection<TaskChecklist> Checklists { get; set; } = new List<TaskChecklist>();
    public ICollection<TimeSheet> TimeSheets { get; set; } = new List<TimeSheet>();
    public ICollection<ResourceAllocation> ResourceAllocations { get; set; } = new List<ResourceAllocation>();
    public Milestone? Milestone { get; set; }
}
