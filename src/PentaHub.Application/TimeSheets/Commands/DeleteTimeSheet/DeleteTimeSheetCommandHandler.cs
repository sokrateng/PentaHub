using MediatR;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.TimeSheets.Commands.DeleteTimeSheet;

public class DeleteTimeSheetCommandHandler : IRequestHandler<DeleteTimeSheetCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTimeSheetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTimeSheetCommand request, CancellationToken cancellationToken)
    {
        var timeSheet = await _context.TimeSheets.FindAsync(new object[] { request.Id }, cancellationToken)
            ?? throw new KeyNotFoundException($"Zaman çizelgesi girişi bulunamadı: {request.Id}");

        // Reverse SpentHours on task
        var task = await _context.ProjectTasks.FindAsync(new object[] { timeSheet.TaskId }, cancellationToken);
        if (task is not null)
        {
            task.SpentHours = Math.Max(0, task.SpentHours - timeSheet.Hours);
            task.RemainingHours = task.PlannedHours > task.SpentHours
                ? task.PlannedHours - task.SpentHours
                : 0;
            if (task.PlannedHours > 0)
                task.ProgressPercent = Math.Min(100, (int)(task.SpentHours / task.PlannedHours * 100));
        }

        timeSheet.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
