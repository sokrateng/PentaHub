using PentaHub.Domain.Enums;

namespace PentaHub.Application.DTOs;

public class TaskChecklistDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int? AssigneeId { get; set; }
    public string? AssigneeName { get; set; }
    public bool IsCompleted { get; set; }
    public int SortOrder { get; set; }
}

public class TaskDependencyDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string TaskNumber { get; set; } = string.Empty;
    public int DependsOnTaskId { get; set; }
    public string DependsOnTaskTitle { get; set; } = string.Empty;
    public string DependsOnTaskNumber { get; set; } = string.Empty;
    public DependencyType DependencyType { get; set; }
    public string DependencyTypeText => DependencyType switch
    {
        DependencyType.FinishToStart => "Bitiş → Başlangıç",
        DependencyType.StartToStart => "Başlangıç → Başlangıç",
        DependencyType.FinishToFinish => "Bitiş → Bitiş",
        DependencyType.StartToFinish => "Başlangıç → Bitiş",
        _ => DependencyType.ToString()
    };
}

public class GanttDependencyDto
{
    public int DependsOnTaskId { get; set; }
    public DependencyType DependencyType { get; set; }
}

public class GanttTaskDto
{
    public int Id { get; set; }
    public string TaskNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public int ProgressPercent { get; set; }
    public string? AssigneeName { get; set; }
    public string? StageName { get; set; }
    public List<GanttDependencyDto> Dependencies { get; set; } = new();
}
