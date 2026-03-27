using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Sprints.Commands.CreateSprint;

public class CreateSprintCommandHandler : IRequestHandler<CreateSprintCommand, SprintDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateSprintCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<SprintDto> Handle(CreateSprintCommand request, CancellationToken cancellationToken)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken)
            ?? throw new KeyNotFoundException($"Proje bulunamadı: {request.ProjectId}");

        var sprint = new Sprint
        {
            Name = request.Name,
            ProjectId = request.ProjectId,
            Goal = request.Goal,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        _context.Sprints.Add(sprint);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.Sprints
            .Include(s => s.Project)
            .FirstAsync(s => s.Id == sprint.Id, cancellationToken);

        var dto = _mapper.Map<SprintDto>(created);
        dto.TaskCount = 0;
        dto.CompletedTaskCount = 0;
        return dto;
    }
}
