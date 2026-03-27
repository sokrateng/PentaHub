using MediatR;

namespace PentaHub.Application.Tasks.Commands.DeleteTask;

public record DeleteTaskCommand(int Id) : IRequest<bool>;
