using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Queries.GetSprintList;

public class GetSprintListQueryHandler : IRequestHandler<GetSprintListQuery, ApiResponse<List<SprintDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSprintListQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<SprintDto>>> Handle(GetSprintListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Sprints
            .Include(s => s.Project)
            .AsQueryable();

        if (request.ProjectId.HasValue)
            query = query.Where(s => s.ProjectId == request.ProjectId.Value);

        if (request.State.HasValue)
            query = query.Where(s => s.State == request.State.Value);

        var sprints = await query
            .OrderBy(s => s.StartDate)
            .ToListAsync(cancellationToken);

        var sprintIds = sprints.Select(s => s.Id).ToList();

        // Get task counts per sprint
        var taskCounts = await _context.ProjectTasks
            .Where(t => t.SprintId.HasValue && sprintIds.Contains(t.SprintId.Value))
            .GroupBy(t => t.SprintId!.Value)
            .Select(g => new { SprintId = g.Key, Total = g.Count(), Completed = g.Count(t => t.ProgressPercent == 100) })
            .ToDictionaryAsync(x => x.SprintId, cancellationToken);

        var dtos = sprints.Select(s =>
        {
            var dto = _mapper.Map<SprintDto>(s);
            if (taskCounts.TryGetValue(s.Id, out var counts))
            {
                dto.TaskCount = counts.Total;
                dto.CompletedTaskCount = counts.Completed;
            }
            return dto;
        }).ToList();

        return ApiResponse<List<SprintDto>>.Ok(dtos);
    }
}
