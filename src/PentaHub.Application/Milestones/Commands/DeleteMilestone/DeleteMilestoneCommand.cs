using MediatR;

namespace PentaHub.Application.Milestones.Commands.DeleteMilestone;

public record DeleteMilestoneCommand(int Id) : IRequest;
