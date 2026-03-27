using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetTaskById;

public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, ProjectTaskDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTaskByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProjectTaskDto?> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.Stage)
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);

        if (task is null) return null;

        var subTaskCount = await _context.ProjectTasks
            .CountAsync(t => t.ParentTaskId == task.Id, cancellationToken);

        var dto = _mapper.Map<ProjectTaskDto>(task);
        dto.SubTaskCount = subTaskCount;
        return dto;
    }
}
