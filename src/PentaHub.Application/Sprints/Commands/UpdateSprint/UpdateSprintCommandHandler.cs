using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Commands.UpdateSprint;

public class UpdateSprintCommandHandler : IRequestHandler<UpdateSprintCommand, SprintDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateSprintCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SprintDto> Handle(UpdateSprintCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Sprint bulunamadı: {request.Id}");

        sprint.Name = request.Name;
        sprint.Goal = request.Goal;
        sprint.StartDate = request.StartDate;
        sprint.EndDate = request.EndDate;

        await _context.SaveChangesAsync(cancellationToken);

        var taskCount = await _context.ProjectTasks
            .CountAsync(t => t.SprintId == sprint.Id, cancellationToken);

        var completedTaskCount = await _context.ProjectTasks
            .Where(t => t.SprintId == sprint.Id)
            .CountAsync(t => t.ProgressPercent == 100, cancellationToken);

        var dto = _mapper.Map<SprintDto>(sprint);
        dto.TaskCount = taskCount;
        dto.CompletedTaskCount = completedTaskCount;
        return dto;
    }
}
