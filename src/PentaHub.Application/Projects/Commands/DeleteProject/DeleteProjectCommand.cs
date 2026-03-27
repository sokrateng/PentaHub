using MediatR;

namespace PentaHub.Application.Projects.Commands.DeleteProject;

public record DeleteProjectCommand(int Id) : IRequest<bool>;
