using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Tasks.Commands.AddDependency;

public class AddDependencyCommandHandler : IRequestHandler<AddDependencyCommand, TaskDependencyDto>
{
    private readonly IApplicationDbContext _context;

    public AddDependencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskDependencyDto> Handle(AddDependencyCommand request, CancellationToken cancellationToken)
    {
        if (request.TaskId == request.DependsOnTaskId)
            throw new InvalidOperationException("Bir görev kendine bağımlı olamaz.");

        // Validate tasks exist
        var task = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new KeyNotFoundException($"Görev bulunamadı: {request.TaskId}");

        var dependsOnTask = await _context.ProjectTasks
            .FirstOrDefaultAsync(t => t.Id == request.DependsOnTaskId, cancellationToken)
            ?? throw new KeyNotFoundException($"Bağımlı görev bulunamadı: {request.DependsOnTaskId}");

        // Check for circular dependency
        if (await HasCircularDependencyAsync(request.TaskId, request.DependsOnTaskId, cancellationToken))
            throw new InvalidOperationException("Döngüsel bağımlılık oluşturulamaz.");

        // Check duplicate
        var exists = await _context.TaskDependencies
            .AnyAsync(d => d.TaskId == request.TaskId && d.DependsOnTaskId == request.DependsOnTaskId, cancellationToken);
        if (exists)
            throw new InvalidOperationException("Bu bağımlılık zaten mevcut.");

        var dependency = new TaskDependency
        {
            TaskId = request.TaskId,
            DependsOnTaskId = request.DependsOnTaskId,
            DependencyType = request.Type
        };

        _context.TaskDependencies.Add(dependency);
        await _context.SaveChangesAsync(cancellationToken);

        return new TaskDependencyDto
        {
            Id = dependency.Id,
            TaskId = task.Id,
            TaskTitle = task.Title,
            TaskNumber = task.TaskNumber,
            DependsOnTaskId = dependsOnTask.Id,
            DependsOnTaskTitle = dependsOnTask.Title,
            DependsOnTaskNumber = dependsOnTask.TaskNumber,
            DependencyType = dependency.DependencyType
        };
    }

    private async Task<bool> HasCircularDependencyAsync(int taskId, int newDependsOnTaskId, CancellationToken cancellationToken)
    {
        // Check if newDependsOnTaskId already depends on taskId (directly or indirectly)
        var visited = new HashSet<int>();
        var queue = new Queue<int>();
        queue.Enqueue(newDependsOnTaskId);

        while (queue.Count > 0)
        {
            var current = queue.Dequeue();
            if (current == taskId)
                return true;

            if (!visited.Add(current))
                continue;

            var upstreamDeps = await _context.TaskDependencies
                .Where(d => d.TaskId == current)
                .Select(d => d.DependsOnTaskId)
                .ToListAsync(cancellationToken);

            foreach (var dep in upstreamDeps)
                queue.Enqueue(dep);
        }

        return false;
    }
}
