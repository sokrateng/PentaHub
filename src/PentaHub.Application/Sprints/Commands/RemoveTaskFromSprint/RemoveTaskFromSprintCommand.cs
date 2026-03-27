using MediatR;

namespace PentaHub.Application.Sprints.Commands.RemoveTaskFromSprint;

public record RemoveTaskFromSprintCommand(int SprintId, int TaskId) : IRequest<bool>;
