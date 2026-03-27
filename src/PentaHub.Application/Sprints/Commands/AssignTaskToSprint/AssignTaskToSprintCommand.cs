using MediatR;

namespace PentaHub.Application.Sprints.Commands.AssignTaskToSprint;

public record AssignTaskToSprintCommand(int SprintId, int TaskId) : IRequest<bool>;
