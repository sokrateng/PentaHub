using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Commands.UpdateTask;

public record UpdateTaskCommand : IRequest<ProjectTaskDto>
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int? AssigneeId { get; init; }
    public int? SprintId { get; init; }
    public int? MilestoneId { get; init; }
    public int? ParentTaskId { get; init; }
    public int Priority { get; init; }
    public bool IsBillable { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? DueDate { get; init; }
    public decimal PlannedHours { get; init; }
    public decimal SpentHours { get; init; }
    public decimal RemainingHours { get; init; }
    public int ProgressPercent { get; init; }
    public string? Tags { get; init; }
}
