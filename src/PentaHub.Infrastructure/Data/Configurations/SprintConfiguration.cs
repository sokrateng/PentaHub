using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class SprintConfiguration : IEntityTypeConfiguration<Sprint>
{
    public void Configure(EntityTypeBuilder<Sprint> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Goal).HasMaxLength(500);
        builder.Property(s => s.State).HasConversion<int>();

        builder.HasOne(s => s.Project)
            .WithMany(p => p.Sprints)
            .HasForeignKey(s => s.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(s => s.ProjectId).HasDatabaseName("IX_Sprints_ProjectId");
        builder.HasIndex(s => s.State).HasDatabaseName("IX_Sprints_State");

        builder.HasQueryFilter(s => !s.IsDeleted);
    }
}
