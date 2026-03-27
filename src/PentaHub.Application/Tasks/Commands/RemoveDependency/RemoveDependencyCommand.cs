using MediatR;

namespace PentaHub.Application.Tasks.Commands.RemoveDependency;

public record RemoveDependencyCommand(int Id) : IRequest;
