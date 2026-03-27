using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Milestones.Commands.UpdateMilestone;

public class UpdateMilestoneCommandHandler : IRequestHandler<UpdateMilestoneCommand, MilestoneDto>
{
    private readonly IApplicationDbContext _context;

    public UpdateMilestoneCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MilestoneDto> Handle(UpdateMilestoneCommand request, CancellationToken cancellationToken)
    {
        var milestone = await _context.Milestones.FindAsync(new object[] { request.Id }, cancellationToken)
            ?? throw new KeyNotFoundException($"Kilometre taşı bulunamadı: {request.Id}");

        milestone.Name = request.Name;
        milestone.TargetDate = request.TargetDate;
        milestone.SortOrder = request.SortOrder;

        await _context.SaveChangesAsync(cancellationToken);

        var taskCount = await _context.ProjectTasks
            .CountAsync(t => t.MilestoneId == milestone.Id, cancellationToken);

        return new MilestoneDto
        {
            Id = milestone.Id,
            ProjectId = milestone.ProjectId,
            Name = milestone.Name,
            TargetDate = milestone.TargetDate,
            SortOrder = milestone.SortOrder,
            TaskCount = taskCount,
            CreatedAt = milestone.CreatedAt
        };
    }
}
