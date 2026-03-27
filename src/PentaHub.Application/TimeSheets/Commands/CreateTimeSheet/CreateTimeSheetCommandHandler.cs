using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.TimeSheets.Commands.CreateTimeSheet;

public class CreateTimeSheetCommandHandler : IRequestHandler<CreateTimeSheetCommand, TimeSheetDto>
{
    private readonly IApplicationDbContext _context;

    public CreateTimeSheetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TimeSheetDto> Handle(CreateTimeSheetCommand request, CancellationToken cancellationToken)
    {
        // Validate user exists
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken)
            ?? throw new KeyNotFoundException($"Kullanıcı bulunamadı: {request.UserId}");

        // Validate task exists
        var task = await _context.ProjectTasks.FindAsync(new object[] { request.TaskId }, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı: {request.TaskId}");

        var timeSheet = new TimeSheet
        {
            UserId = request.UserId,
            TaskId = request.TaskId,
            Date = request.Date,
            Hours = request.Hours,
            Description = request.Description,
            IsBillable = request.IsBillable
        };

        _context.TimeSheets.Add(timeSheet);

        // Update task SpentHours
        task.SpentHours += request.Hours;
        if (task.RemainingHours > 0)
            task.RemainingHours = Math.Max(0, task.RemainingHours - request.Hours);
        if (task.PlannedHours > 0)
            task.ProgressPercent = Math.Min(100, (int)(task.SpentHours / task.PlannedHours * 100));

        await _context.SaveChangesAsync(cancellationToken);

        return new TimeSheetDto
        {
            Id = timeSheet.Id,
            UserId = timeSheet.UserId,
            UserFullName = user.FullName,
            TaskId = timeSheet.TaskId,
            TaskTitle = task.Title,
            TaskNumber = task.TaskNumber,
            Date = timeSheet.Date,
            Hours = timeSheet.Hours,
            Description = timeSheet.Description,
            IsBillable = timeSheet.IsBillable,
            CreatedAt = timeSheet.CreatedAt
        };
    }
}
