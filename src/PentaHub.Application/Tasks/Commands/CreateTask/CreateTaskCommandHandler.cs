using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tasks.Commands.CreateTask;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, ProjectTaskDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateTaskCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProjectTaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        // Auto-generate TaskNumber
        var lastTaskNumber = await _context.ProjectTasks
            .Where(t => t.ProjectId == request.ProjectId)
            .OrderByDescending(t => t.Id)
            .Select(t => t.TaskNumber)
            .FirstOrDefaultAsync(cancellationToken);

        int nextNumber = 1;
        if (!string.IsNullOrEmpty(lastTaskNumber) && lastTaskNumber.StartsWith("T"))
        {
            if (int.TryParse(lastTaskNumber[1..], out int parsed))
            {
                nextNumber = parsed + 1;
            }
        }
        var taskNumber = $"T{nextNumber:D4}";

        // Find default stage for this project
        var defaultStage = await _context.TaskStages
            .Where(s => s.ProjectId == request.ProjectId && s.IsDefault)
            .FirstOrDefaultAsync(cancellationToken)
            ?? await _context.TaskStages
                .Where(s => s.ProjectId == request.ProjectId)
                .OrderBy(s => s.SortOrder)
                .FirstOrDefaultAsync(cancellationToken)
            ?? throw new KeyNotFoundException($"Proje için aşama bulunamadı: {request.ProjectId}");

        // Calculate SortOrder (max + 1 within the stage)
        var maxSortOrder = await _context.ProjectTasks
            .Where(t => t.StageId == defaultStage.Id)
            .MaxAsync(t => (int?)t.SortOrder, cancellationToken) ?? 0;

        var task = new ProjectTask
        {
            TaskNumber = taskNumber,
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            StageId = defaultStage.Id,
            AssigneeId = request.AssigneeId,
            Priority = (Priority)request.Priority,
            IsBillable = request.IsBillable,
            StartDate = request.StartDate,
            DueDate = request.DueDate,
            PlannedHours = request.PlannedHours,
            RemainingHours = request.PlannedHours,
            SortOrder = maxSortOrder + 1
        };

        _context.ProjectTasks.Add(task);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .FirstAsync(t => t.Id == task.Id, cancellationToken);

        var dto = _mapper.Map<ProjectTaskDto>(created);
        dto.SubTaskCount = 0;
        return dto;
    }
}
