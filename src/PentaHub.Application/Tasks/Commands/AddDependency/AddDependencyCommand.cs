using MediatR;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tasks.Commands.AddDependency;

public record AddDependencyCommand : IRequest<TaskDependencyDto>
{
    public int TaskId { get; init; }
    public int DependsOnTaskId { get; init; }
    public DependencyType Type { get; init; } = DependencyType.FinishToStart;
}
