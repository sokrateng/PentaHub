using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Milestones.Commands.CreateMilestone;

public record CreateMilestoneCommand : IRequest<MilestoneDto>
{
    public int ProjectId { get; init; }
    public string Name { get; init; } = string.Empty;
    public DateTime? TargetDate { get; init; }
    public int SortOrder { get; init; }
}
