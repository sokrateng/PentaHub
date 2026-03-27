using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tasks.Commands.UpdateTask;

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, ProjectTaskDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateTaskCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProjectTaskDto> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı: {request.Id}");

        task.Title = request.Title;
        task.Description = request.Description;
        task.AssigneeId = request.AssigneeId;
        task.SprintId = request.SprintId;
        task.MilestoneId = request.MilestoneId;
        task.ParentTaskId = request.ParentTaskId;
        task.Priority = (Priority)request.Priority;
        task.IsBillable = request.IsBillable;
        task.StartDate = request.StartDate;
        task.DueDate = request.DueDate;
        task.PlannedHours = request.PlannedHours;
        task.SpentHours = request.SpentHours;
        task.RemainingHours = request.RemainingHours;
        task.ProgressPercent = request.ProgressPercent;
        task.Tags = request.Tags;

        await _context.SaveChangesAsync(cancellationToken);

        var updated = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .FirstAsync(t => t.Id == task.Id, cancellationToken);

        var subTaskCount = await _context.ProjectTasks
            .CountAsync(t => t.ParentTaskId == task.Id, cancellationToken);

        var dto = _mapper.Map<ProjectTaskDto>(updated);
        dto.SubTaskCount = subTaskCount;
        return dto;
    }
}
