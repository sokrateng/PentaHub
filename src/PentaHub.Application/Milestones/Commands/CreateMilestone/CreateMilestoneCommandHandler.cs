using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Milestones.Commands.CreateMilestone;

public class CreateMilestoneCommandHandler : IRequestHandler<CreateMilestoneCommand, MilestoneDto>
{
    private readonly IApplicationDbContext _context;

    public CreateMilestoneCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<MilestoneDto> Handle(CreateMilestoneCommand request, CancellationToken cancellationToken)
    {
        // Validate project exists
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == request.ProjectId, cancellationToken);
        if (!projectExists)
            throw new KeyNotFoundException($"Proje bulunamadı: {request.ProjectId}");

        // Auto-assign SortOrder if not provided
        var sortOrder = request.SortOrder > 0
            ? request.SortOrder
            : (await _context.Milestones
                .Where(m => m.ProjectId == request.ProjectId)
                .MaxAsync(m => (int?)m.SortOrder, cancellationToken) ?? 0) + 1;

        var milestone = new Milestone
        {
            ProjectId = request.ProjectId,
            Name = request.Name,
            TargetDate = request.TargetDate,
            SortOrder = sortOrder
        };

        _context.Milestones.Add(milestone);
        await _context.SaveChangesAsync(cancellationToken);

        return new MilestoneDto
        {
            Id = milestone.Id,
            ProjectId = milestone.ProjectId,
            Name = milestone.Name,
            TargetDate = milestone.TargetDate,
            SortOrder = milestone.SortOrder,
            TaskCount = 0,
            CreatedAt = milestone.CreatedAt
        };
    }
}
