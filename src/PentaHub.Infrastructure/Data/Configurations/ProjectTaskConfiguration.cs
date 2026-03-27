using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
{
    public void Configure(EntityTypeBuilder<ProjectTask> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.TaskNumber).IsRequired().HasMaxLength(20);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(500);
        builder.Property(t => t.Description).HasColumnType("text");
        builder.Property(t => t.Tags).HasMaxLength(500);
        builder.Property(t => t.Priority).HasConversion<int>();
        builder.Property(t => t.PlannedHours).HasColumnType("decimal(10,2)");
        builder.Property(t => t.SpentHours).HasColumnType("decimal(10,2)");
        builder.Property(t => t.RemainingHours).HasColumnType("decimal(10,2)");

        builder.HasOne(t => t.Project).WithMany(p => p.Tasks).HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(t => t.Stage).WithMany(s => s.Tasks).HasForeignKey(t => t.StageId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(t => t.Assignee).WithMany().HasForeignKey(t => t.AssigneeId).OnDelete(DeleteBehavior.SetNull);
        builder.HasOne(t => t.ParentTask).WithMany(t => t.SubTasks).HasForeignKey(t => t.ParentTaskId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(t => t.TaskNumber).IsUnique().HasDatabaseName("IX_Tasks_TaskNumber");
        builder.HasIndex(t => t.ProjectId).HasDatabaseName("IX_Tasks_ProjectId");
        builder.HasIndex(t => t.StageId).HasDatabaseName("IX_Tasks_StageId");
        builder.HasIndex(t => t.AssigneeId).HasDatabaseName("IX_Tasks_AssigneeId");
        builder.HasIndex(t => t.SprintId).HasDatabaseName("IX_Tasks_SprintId");
        builder.HasIndex(t => t.ParentTaskId).HasDatabaseName("IX_Tasks_ParentTaskId");

        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
