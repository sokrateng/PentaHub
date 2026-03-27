using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetDependenciesByTask;

public record GetDependenciesByTaskQuery(int TaskId) : IRequest<List<TaskDependencyDto>>;
