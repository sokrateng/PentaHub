using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Queries.GetSprintDetail;

public class GetSprintDetailQueryHandler : IRequestHandler<GetSprintDetailQuery, SprintDetailDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSprintDetailQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SprintDetailDto?> Handle(GetSprintDetailQuery request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (sprint is null) return null;

        var tasks = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .Where(t => t.SprintId == sprint.Id && t.ParentTaskId == null)
            .OrderBy(t => t.SortOrder)
            .ToListAsync(cancellationToken);

        var taskIds = tasks.Select(t => t.Id).ToList();
        var subTaskCounts = await _context.ProjectTasks
            .Where(t => t.ParentTaskId.HasValue && taskIds.Contains(t.ParentTaskId.Value))
            .GroupBy(t => t.ParentTaskId!.Value)
            .Select(g => new { ParentTaskId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ParentTaskId, x => x.Count, cancellationToken);

        var dto = _mapper.Map<SprintDetailDto>(sprint);
        dto.Tasks = tasks.Select(t =>
        {
            var taskDto = _mapper.Map<ProjectTaskDto>(t);
            taskDto.SubTaskCount = subTaskCounts.TryGetValue(t.Id, out var count) ? count : 0;
            return taskDto;
        }).ToList();
        dto.TaskCount = dto.Tasks.Count;
        dto.CompletedTaskCount = dto.Tasks.Count(t => t.ProgressPercent == 100);

        return dto;
    }
}
