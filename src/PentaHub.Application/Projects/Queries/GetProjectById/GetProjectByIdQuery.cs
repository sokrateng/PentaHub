using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Projects.Queries.GetProjectById;

public record GetProjectByIdQuery(int Id) : IRequest<ProjectDto?>;
