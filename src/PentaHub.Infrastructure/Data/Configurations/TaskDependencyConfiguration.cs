using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class TaskDependencyConfiguration : IEntityTypeConfiguration<TaskDependency>
{
    public void Configure(EntityTypeBuilder<TaskDependency> builder)
    {
        builder.HasKey(d => d.Id);
        builder.Property(d => d.DependencyType).HasConversion<int>();

        builder.HasOne(d => d.Task)
            .WithMany(t => t.Dependencies)
            .HasForeignKey(d => d.TaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.DependsOnTask)
            .WithMany(t => t.Dependents)
            .HasForeignKey(d => d.DependsOnTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(d => d.TaskId).HasDatabaseName("IX_TaskDependencies_TaskId");
        builder.HasIndex(d => d.DependsOnTaskId).HasDatabaseName("IX_TaskDependencies_DependsOnTaskId");

        builder.HasQueryFilter(d => !d.IsDeleted);
    }
}
