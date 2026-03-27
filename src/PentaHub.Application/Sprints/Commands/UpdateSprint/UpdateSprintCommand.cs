using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Commands.UpdateSprint;

public record UpdateSprintCommand : IRequest<SprintDto>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Goal { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
}
