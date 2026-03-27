using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Commands.CreateTask;

public record CreateTaskCommand : IRequest<ProjectTaskDto>
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public int ProjectId { get; init; }
    public int? AssigneeId { get; init; }
    public int Priority { get; init; }
    public bool IsBillable { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? DueDate { get; init; }
    public decimal PlannedHours { get; init; }
}
