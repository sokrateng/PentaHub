using PentaHub.Domain.Enums;

namespace PentaHub.Application.DTOs;

public class TaskStageDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsClosedStage { get; set; }
    public bool ShowInKanban { get; set; }
}

public class ProjectTaskDto
{
    public int Id { get; set; }
    public string TaskNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public int StageId { get; set; }
    public string? StageName { get; set; }
    public int? AssigneeId { get; set; }
    public string? AssigneeName { get; set; }
    public int? SprintId { get; set; }
    public int? MilestoneId { get; set; }
    public int? ParentTaskId { get; set; }
    public Priority Priority { get; set; }
    public string PriorityText => Priority switch
    {
        Priority.None => "Yok",
        Priority.Low => "Düşük",
        Priority.Medium => "Orta",
        Priority.High => "Yüksek",
        Priority.Critical => "Kritik",
        _ => Priority.ToString()
    };
    public bool IsBillable { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public decimal PlannedHours { get; set; }
    public decimal SpentHours { get; set; }
    public decimal RemainingHours { get; set; }
    public int ProgressPercent { get; set; }
    public string? Tags { get; set; }
    public int SortOrder { get; set; }
    public int SubTaskCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TaskKanbanDto
{
    public int StageId { get; set; }
    public string StageName { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public List<ProjectTaskDto> Tasks { get; set; } = new();
}
