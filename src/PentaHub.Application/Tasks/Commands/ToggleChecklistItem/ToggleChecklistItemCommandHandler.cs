using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Commands.ToggleChecklistItem;

public class ToggleChecklistItemCommandHandler : IRequestHandler<ToggleChecklistItemCommand, TaskChecklistDto>
{
    private readonly IApplicationDbContext _context;

    public ToggleChecklistItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskChecklistDto> Handle(ToggleChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.TaskChecklists
            .Include(c => c.Assignee)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Kontrol listesi öğesi bulunamadı: {request.Id}");

        item.IsCompleted = !item.IsCompleted;

        // Update task ProgressPercent based on checklist completion ratio
        var allItems = await _context.TaskChecklists
            .Where(c => c.TaskId == item.TaskId)
            .ToListAsync(cancellationToken);

        var completedCount = allItems.Count(c => c.Id == item.Id ? item.IsCompleted : c.IsCompleted);
        var totalCount = allItems.Count;

        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == item.TaskId, cancellationToken);

        if (task != null && totalCount > 0)
        {
            task.ProgressPercent = (int)Math.Round((double)completedCount / totalCount * 100);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new TaskChecklistDto
        {
            Id = item.Id,
            TaskId = item.TaskId,
            Title = item.Title,
            AssigneeId = item.AssigneeId,
            AssigneeName = item.Assignee?.FullName,
            IsCompleted = item.IsCompleted,
            SortOrder = item.SortOrder
        };
    }
}
