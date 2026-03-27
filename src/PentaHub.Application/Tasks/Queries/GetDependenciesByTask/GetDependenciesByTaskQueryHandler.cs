using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetDependenciesByTask;

public class GetDependenciesByTaskQueryHandler : IRequestHandler<GetDependenciesByTaskQuery, List<TaskDependencyDto>>
{
    private readonly IApplicationDbContext _context;

    public GetDependenciesByTaskQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskDependencyDto>> Handle(GetDependenciesByTaskQuery request, CancellationToken cancellationToken)
    {
        return await _context.TaskDependencies
            .Include(d => d.Task)
            .Include(d => d.DependsOnTask)
            .Where(d => d.TaskId == request.TaskId)
            .Select(d => new TaskDependencyDto
            {
                Id = d.Id,
                TaskId = d.TaskId,
                TaskTitle = d.Task.Title,
                TaskNumber = d.Task.TaskNumber,
                DependsOnTaskId = d.DependsOnTaskId,
                DependsOnTaskTitle = d.DependsOnTask.Title,
                DependsOnTaskNumber = d.DependsOnTask.TaskNumber,
                DependencyType = d.DependencyType
            })
            .ToListAsync(cancellationToken);
    }
}
