using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Sprints.Commands.RemoveTaskFromSprint;

public class RemoveTaskFromSprintCommandHandler : IRequestHandler<RemoveTaskFromSprintCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RemoveTaskFromSprintCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RemoveTaskFromSprintCommand request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.TaskId && t.SprintId == request.SprintId, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı veya bu sprinte ait değil. Görev: {request.TaskId}, Sprint: {request.SprintId}");

        task.SprintId = null;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
