using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Commands.AddChecklistItem;

public record AddChecklistItemCommand : IRequest<TaskChecklistDto>
{
    public int TaskId { get; init; }
    public string Title { get; init; } = string.Empty;
    public int? AssigneeId { get; init; }
}
