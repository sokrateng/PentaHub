using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name).IsRequired().HasMaxLength(300);
        builder.Property(p => p.Description).HasColumnType("text");
        builder.Property(p => p.DepartmentName).HasMaxLength(100);
        builder.Property(p => p.ProjectEmail).HasMaxLength(200);
        builder.Property(p => p.EvaluationFrequency).HasMaxLength(50);

        builder.Property(p => p.Status).HasConversion<int>();
        builder.Property(p => p.PrivacyLevel).HasConversion<int>();
        builder.Property(p => p.CustomerEvaluation).HasConversion<int>();

        builder.Property(p => p.IsBillable).HasDefaultValue(false);
        builder.Property(p => p.IsTemplate).HasDefaultValue(false);

        builder.HasOne(p => p.ProjectManager)
            .WithMany(u => u.ManagedProjects)
            .HasForeignKey(p => p.ProjectManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.Status).HasDatabaseName("IX_Projects_Status");
        builder.HasIndex(p => p.ProjectManagerId).HasDatabaseName("IX_Projects_ProjectManagerId");
        builder.HasIndex(p => p.ContactId).HasDatabaseName("IX_Projects_ContactId");

        builder.HasQueryFilter(p => !p.IsDeleted);
    }
}
