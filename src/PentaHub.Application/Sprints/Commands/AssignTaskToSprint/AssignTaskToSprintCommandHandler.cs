using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Sprints.Commands.AssignTaskToSprint;

public class AssignTaskToSprintCommandHandler : IRequestHandler<AssignTaskToSprintCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AssignTaskToSprintCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AssignTaskToSprintCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints
            .FirstOrDefaultAsync(s => s.Id == request.SprintId, cancellationToken)
            ?? throw new KeyNotFoundException($"Sprint bulunamadı: {request.SprintId}");

        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı: {request.TaskId}");

        task.SprintId = sprint.Id;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
