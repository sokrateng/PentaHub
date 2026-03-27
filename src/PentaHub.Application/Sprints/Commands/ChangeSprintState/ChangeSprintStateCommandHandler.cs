using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Sprints.Commands.ChangeSprintState;

public class ChangeSprintStateCommandHandler : IRequestHandler<ChangeSprintStateCommand, SprintDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ChangeSprintStateCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SprintDto> Handle(ChangeSprintStateCommand request, CancellationToken cancellationToken)
    {
        var sprint = await _context.Sprints
            .Include(s => s.Project)
            .FirstOrDefaultAsync(s => s.Id == request.SprintId, cancellationToken)
            ?? throw new KeyNotFoundException($"Sprint bulunamadı: {request.SprintId}");

        // Validate state transition: Draft→InProgress→Done, no backwards
        var validTransition = (sprint.State, request.NewState) switch
        {
            (SprintState.Draft, SprintState.InProgress) => true,
            (SprintState.InProgress, SprintState.Done) => true,
            _ => false
        };

        if (!validTransition)
        {
            throw new InvalidOperationException(
                $"Geçersiz durum geçişi: {sprint.State} → {request.NewState}. " +
                "Sadece Taslak→Devam Eden→Tamamlandı geçişine izin verilir.");
        }

        sprint.State = request.NewState;
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
