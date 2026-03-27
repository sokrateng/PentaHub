using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Tasks.Commands.AddChecklistItem;

public class AddChecklistItemCommandHandler : IRequestHandler<AddChecklistItemCommand, TaskChecklistDto>
{
    private readonly IApplicationDbContext _context;

    public AddChecklistItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskChecklistDto> Handle(AddChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var taskExists = await _context.ProjectTasks
            .AnyAsync(t => t.Id == request.TaskId, cancellationToken);

        if (!taskExists)
            throw new KeyNotFoundException($"Görev bulunamadı: {request.TaskId}");

        var maxSortOrder = await _context.TaskChecklists
            .Where(c => c.TaskId == request.TaskId)
            .MaxAsync(c => (int?)c.SortOrder, cancellationToken) ?? 0;

        var item = new TaskChecklist
        {
            TaskId = request.TaskId,
            Title = request.Title,
            AssigneeId = request.AssigneeId,
            IsCompleted = false,
            SortOrder = maxSortOrder + 1
        };

        _context.TaskChecklists.Add(item);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.TaskChecklists
            .Include(c => c.Assignee)
            .FirstAsync(c => c.Id == item.Id, cancellationToken);

        return new TaskChecklistDto
        {
            Id = created.Id,
            TaskId = created.TaskId,
            Title = created.Title,
            AssigneeId = created.AssigneeId,
            AssigneeName = created.Assignee?.FullName,
            IsCompleted = created.IsCompleted,
            SortOrder = created.SortOrder
        };
    }
}
