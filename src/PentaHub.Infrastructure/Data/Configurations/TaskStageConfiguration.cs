using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class TaskStageConfiguration : IEntityTypeConfiguration<TaskStage>
{
    public void Configure(EntityTypeBuilder<TaskStage> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(100);
        builder.HasOne(t => t.Project).WithMany(p => p.TaskStages).HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
        builder.HasQueryFilter(t => !t.IsDeleted);
    }
}
