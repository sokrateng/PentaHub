using Microsoft.EntityFrameworkCore;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Project> Projects { get; }
    DbSet<TaskStage> TaskStages { get; }
    DbSet<ProjectTask> ProjectTasks { get; }
    DbSet<Sprint> Sprints { get; }
    DbSet<TaskDependency> TaskDependencies { get; }
    DbSet<TaskChecklist> TaskChecklists { get; }
    DbSet<Milestone> Milestones { get; }
    DbSet<ResourceAllocation> ResourceAllocations { get; }
    DbSet<TimeSheet> TimeSheets { get; }
    DbSet<Comment> Comments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
