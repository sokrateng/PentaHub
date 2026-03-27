using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Projects.Queries.GetProjectMetrics;

public class GetProjectMetricsQueryHandler : IRequestHandler<GetProjectMetricsQuery, ProjectMetricsDto>
{
    private readonly IApplicationDbContext _context;

    public GetProjectMetricsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProjectMetricsDto> Handle(GetProjectMetricsQuery request, CancellationToken cancellationToken)
    {
        var projectId = request.ProjectId;
        var now = DateTime.UtcNow;

        // Load task stage data for the project (needed for IsClosedStage checks)
        var taskStageMap = await _context.TaskStages
            .Where(s => s.ProjectId == projectId)
            .Select(s => new { s.Id, s.IsClosedStage })
            .ToDictionaryAsync(s => s.Id, s => s.IsClosedStage, cancellationToken);

        // Load all tasks for the project with minimal fields
        var tasks = await _context.ProjectTasks
            .Where(t => t.ProjectId == projectId)
            .Select(t => new { t.Id, t.StageId, t.DueDate, t.Priority })
            .ToListAsync(cancellationToken);

        var taskIds = tasks.Select(t => t.Id).ToList();

        // Comments: documents (Note + Email) and meetings
        var commentCounts = await _context.Comments
            .Where(c => c.EntityType == "Project" && c.EntityId == projectId)
            .GroupBy(c => c.CommentType)
            .Select(g => new { CommentType = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var documentCount = commentCounts
            .Where(c => c.CommentType == CommentType.Note || c.CommentType == CommentType.Email)
            .Sum(c => c.Count);

        var meetingCount = commentCounts
            .Where(c => c.CommentType == CommentType.Meeting)
            .Sum(c => c.Count);

        // Timesheet aggregates
        var timesheetData = await _context.TimeSheets
            .Where(ts => taskIds.Contains(ts.TaskId))
            .Select(ts => new { ts.Hours, ts.IsBillable })
            .ToListAsync(cancellationToken);

        var totalHours = timesheetData.Sum(ts => ts.Hours);
        var billableHours = timesheetData.Where(ts => ts.IsBillable).Sum(ts => ts.Hours);

        // Resource count: distinct users assigned to this project
        var resourceCount = await _context.ResourceAllocations
            .Where(ra => ra.ProjectId == projectId)
            .Select(ra => ra.UserId)
            .Distinct()
            .CountAsync(cancellationToken);

        // Milestone and sprint counts
        var milestoneCount = await _context.Milestones
            .CountAsync(m => m.ProjectId == projectId, cancellationToken);

        var sprintCount = await _context.Sprints
            .CountAsync(s => s.ProjectId == projectId, cancellationToken);

        // Task derived counts (computed in-memory using loaded task data + stage map)
        var taskCount = tasks.Count;

        var activeTaskCount = tasks.Count(t =>
            taskStageMap.TryGetValue(t.StageId, out var isClosed) && !isClosed);

        var completedTaskCount = tasks.Count(t =>
            taskStageMap.TryGetValue(t.StageId, out var isClosed) && isClosed);

        var overdueTaskCount = tasks.Count(t =>
            t.DueDate.HasValue
            && t.DueDate.Value < now
            && taskStageMap.TryGetValue(t.StageId, out var isClosed)
            && !isClosed);

        // RiskCount: overdue OR critical priority tasks that are not in closed stage
        var riskCount = tasks.Count(t =>
            taskStageMap.TryGetValue(t.StageId, out var isClosed)
            && !isClosed
            && (t.Priority >= Priority.Critical || (t.DueDate.HasValue && t.DueDate.Value < now)));

        return new ProjectMetricsDto
        {
            DocumentCount = documentCount,
            TaskCount = taskCount,
            MeetingCount = meetingCount,
            TotalHours = totalHours,
            ActiveTaskCount = activeTaskCount,
            RiskCount = riskCount,
            ResourceCount = resourceCount,
            CompletedTaskCount = completedTaskCount,
            BillableHours = billableHours,
            OverdueTaskCount = overdueTaskCount,
            MilestoneCount = milestoneCount,
            SprintCount = sprintCount
        };
    }
}
