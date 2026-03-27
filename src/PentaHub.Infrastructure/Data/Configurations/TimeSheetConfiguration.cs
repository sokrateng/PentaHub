using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class TimeSheetConfiguration : IEntityTypeConfiguration<TimeSheet>
{
    public void Configure(EntityTypeBuilder<TimeSheet> builder)
    {
        builder.HasKey(ts => ts.Id);

        builder.Property(ts => ts.Hours).HasColumnType("decimal(4,2)");
        builder.Property(ts => ts.Description).HasMaxLength(500);

        builder.HasOne(ts => ts.User)
            .WithMany(u => u.TimeSheets)
            .HasForeignKey(ts => ts.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(ts => ts.Task)
            .WithMany(t => t.TimeSheets)
            .HasForeignKey(ts => ts.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(ts => ts.UserId).HasDatabaseName("IX_TimeSheets_UserId");
        builder.HasIndex(ts => ts.TaskId).HasDatabaseName("IX_TimeSheets_TaskId");
        builder.HasIndex(ts => ts.Date).HasDatabaseName("IX_TimeSheets_Date");

        builder.HasQueryFilter(ts => !ts.IsDeleted);
    }
}
