using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class ResourceAllocationConfiguration : IEntityTypeConfiguration<ResourceAllocation>
{
    public void Configure(EntityTypeBuilder<ResourceAllocation> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Notes).HasMaxLength(500);
        builder.Property(r => r.HoursPerDay).HasColumnType("decimal(4,2)");
        builder.Property(r => r.TotalHours).HasColumnType("decimal(10,2)");

        builder.HasOne(r => r.User)
            .WithMany(u => u.ResourceAllocations)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Project)
            .WithMany(p => p.ResourceAllocations)
            .HasForeignKey(r => r.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Task)
            .WithMany(t => t.ResourceAllocations)
            .HasForeignKey(r => r.TaskId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(r => r.UserId).HasDatabaseName("IX_ResourceAllocations_UserId");
        builder.HasIndex(r => r.ProjectId).HasDatabaseName("IX_ResourceAllocations_ProjectId");
        builder.HasIndex(r => r.TaskId).HasDatabaseName("IX_ResourceAllocations_TaskId");

        builder.HasQueryFilter(r => !r.IsDeleted);
    }
}
