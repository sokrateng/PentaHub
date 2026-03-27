using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Queries.GetBacklog;

public class GetBacklogQueryHandler : IRequestHandler<GetBacklogQuery, ApiResponse<List<ProjectTaskDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBacklogQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ProjectTaskDto>>> Handle(GetBacklogQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .Where(t => t.ProjectId == request.ProjectId && t.SprintId == null && t.ParentTaskId == null)
            .OrderBy(t => t.SortOrder)
            .ToListAsync(cancellationToken);

        var taskIds = tasks.Select(t => t.Id).ToList();
        var subTaskCounts = await _context.ProjectTasks
            .Where(t => t.ParentTaskId.HasValue && taskIds.Contains(t.ParentTaskId.Value))
            .GroupBy(t => t.ParentTaskId!.Value)
            .Select(g => new { ParentTaskId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ParentTaskId, x => x.Count, cancellationToken);

        var dtos = tasks.Select(t =>
        {
            var dto = _mapper.Map<ProjectTaskDto>(t);
            dto.SubTaskCount = subTaskCounts.TryGetValue(t.Id, out var count) ? count : 0;
            return dto;
        }).ToList();

        return ApiResponse<List<ProjectTaskDto>>.Ok(dtos);
    }
}
