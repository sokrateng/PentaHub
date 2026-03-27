using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Milestones.Queries.GetMilestonesByProject;

public class GetMilestonesByProjectQueryHandler : IRequestHandler<GetMilestonesByProjectQuery, ApiResponse<List<MilestoneDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetMilestonesByProjectQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<MilestoneDto>>> Handle(GetMilestonesByProjectQuery request, CancellationToken cancellationToken)
    {
        var milestones = await _context.Milestones
            .Where(m => m.ProjectId == request.ProjectId)
            .OrderBy(m => m.SortOrder)
            .ToListAsync(cancellationToken);

        var milestoneIds = milestones.Select(m => m.Id).ToList();

        // Count tasks per milestone
        var taskCounts = await _context.ProjectTasks
            .Where(t => t.MilestoneId != null && milestoneIds.Contains(t.MilestoneId.Value))
            .GroupBy(t => t.MilestoneId!.Value)
            .Select(g => new { MilestoneId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.MilestoneId, x => x.Count, cancellationToken);

        var dtos = milestones.Select(m => new MilestoneDto
        {
            Id = m.Id,
            ProjectId = m.ProjectId,
            Name = m.Name,
            TargetDate = m.TargetDate,
            SortOrder = m.SortOrder,
            TaskCount = taskCounts.TryGetValue(m.Id, out var count) ? count : 0,
            CreatedAt = m.CreatedAt
        }).ToList();

        return ApiResponse<List<MilestoneDto>>.Ok(dtos);
    }
}
