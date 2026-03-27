using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Milestones.Commands.UpdateMilestone;

public record UpdateMilestoneCommand : IRequest<MilestoneDto>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public DateTime? TargetDate { get; init; }
    public int SortOrder { get; init; }
}
