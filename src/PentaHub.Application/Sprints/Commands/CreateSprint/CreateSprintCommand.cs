using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Commands.CreateSprint;

public record CreateSprintCommand : IRequest<SprintDto>
{
    public string Name { get; init; } = string.Empty;
    public int ProjectId { get; init; }
    public string? Goal { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
}
