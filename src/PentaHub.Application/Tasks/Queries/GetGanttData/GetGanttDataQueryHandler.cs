using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetGanttData;

public class GetGanttDataQueryHandler : IRequestHandler<GetGanttDataQuery, List<GanttTaskDto>>
{
    private readonly IApplicationDbContext _context;

    public GetGanttDataQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<GanttTaskDto>> Handle(GetGanttDataQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _context.ProjectTasks
            .Include(t => t.Assignee)
            .Include(t => t.Stage)
            .Include(t => t.Dependencies)
            .Where(t => t.ProjectId == request.ProjectId && t.ParentTaskId == null)
            .OrderBy(t => t.SortOrder)
            .ToListAsync(cancellationToken);

        return tasks.Select(t => new GanttTaskDto
        {
            Id = t.Id,
            TaskNumber = t.TaskNumber,
            Title = t.Title,
            StartDate = t.StartDate,
            DueDate = t.DueDate,
            ProgressPercent = t.ProgressPercent,
            AssigneeName = t.Assignee?.FullName,
            StageName = t.Stage?.Name,
            Dependencies = t.Dependencies
                .Select(d => new GanttDependencyDto
                {
                    DependsOnTaskId = d.DependsOnTaskId,
                    DependencyType = d.DependencyType
                })
                .ToList()
        }).ToList();
    }
}
