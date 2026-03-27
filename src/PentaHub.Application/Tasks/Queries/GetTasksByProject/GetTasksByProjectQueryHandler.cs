using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetTasksByProject;

public class GetTasksByProjectQueryHandler : IRequestHandler<GetTasksByProjectQuery, ApiResponse<List<TaskKanbanDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTasksByProjectQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<TaskKanbanDto>>> Handle(GetTasksByProjectQuery request, CancellationToken cancellationToken)
    {
        var stages = await _context.TaskStages
            .Where(s => s.ProjectId == request.ProjectId)
            .OrderBy(s => s.SortOrder)
            .ToListAsync(cancellationToken);

        var tasks = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .Where(t => t.ProjectId == request.ProjectId && t.ParentTaskId == null)
            .OrderBy(t => t.SortOrder)
            .ToListAsync(cancellationToken);

        // Count sub-tasks for each task
        var taskIds = tasks.Select(t => t.Id).ToList();
        var subTaskCounts = await _context.ProjectTasks
            .Where(t => t.ParentTaskId != null && taskIds.Contains(t.ParentTaskId.Value))
            .GroupBy(t => t.ParentTaskId!.Value)
            .Select(g => new { ParentTaskId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ParentTaskId, x => x.Count, cancellationToken);

        var kanbanDtos = stages.Select(stage =>
        {
            var stageTasks = tasks
                .Where(t => t.StageId == stage.Id)
                .Select(t =>
                {
                    var dto = _mapper.Map<ProjectTaskDto>(t);
                    dto.SubTaskCount = subTaskCounts.TryGetValue(t.Id, out var count) ? count : 0;
                    return dto;
                })
                .ToList();

            return new TaskKanbanDto
            {
                StageId = stage.Id,
                StageName = stage.Name,
                SortOrder = stage.SortOrder,
                Tasks = stageTasks
            };
        }).ToList();

        return ApiResponse<List<TaskKanbanDto>>.Ok(kanbanDtos);
    }
}
