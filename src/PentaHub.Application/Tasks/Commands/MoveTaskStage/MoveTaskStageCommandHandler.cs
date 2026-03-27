using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Tasks.Commands.MoveTaskStage;

public class MoveTaskStageCommandHandler : IRequestHandler<MoveTaskStageCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public MoveTaskStageCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(MoveTaskStageCommand request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı: {request.TaskId}");

        var stageExists = await _context.TaskStages
            .AnyAsync(s => s.Id == request.StageId, cancellationToken);

        if (!stageExists)
            throw new KeyNotFoundException($"Aşama bulunamadı: {request.StageId}");

        // Calculate SortOrder (append to end of new stage)
        var maxSortOrder = await _context.ProjectTasks
            .Where(t => t.StageId == request.StageId)
            .MaxAsync(t => (int?)t.SortOrder, cancellationToken) ?? 0;

        task.StageId = request.StageId;
        task.SortOrder = maxSortOrder + 1;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
