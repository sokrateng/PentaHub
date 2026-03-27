using PentaHub.Domain.Enums;

namespace PentaHub.Application.DTOs;

public class SprintDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public SprintState State { get; set; }
    public string StateText => State switch
    {
        SprintState.Draft => "Taslak",
        SprintState.InProgress => "Devam Eden",
        SprintState.Done => "Tamamlandı",
        _ => State.ToString()
    };
    public string? Goal { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public int ProgressPercent => TaskCount == 0 ? 0 : (int)Math.Round((double)CompletedTaskCount / TaskCount * 100);
}

public class SprintDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public SprintState State { get; set; }
    public string StateText => State switch
    {
        SprintState.Draft => "Taslak",
        SprintState.InProgress => "Devam Eden",
        SprintState.Done => "Tamamlandı",
        _ => State.ToString()
    };
    public string? Goal { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TaskCount { get; set; }
    public int CompletedTaskCount { get; set; }
    public int ProgressPercent => TaskCount == 0 ? 0 : (int)Math.Round((double)CompletedTaskCount / TaskCount * 100);
    public List<ProjectTaskDto> Tasks { get; set; } = new();
}
