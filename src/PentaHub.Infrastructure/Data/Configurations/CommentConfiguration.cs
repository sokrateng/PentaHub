using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.EntityType).IsRequired().HasMaxLength(50);
        builder.Property(c => c.EntityId).IsRequired();
        builder.Property(c => c.Content).IsRequired().HasColumnType("text");
        builder.Property(c => c.CommentType).HasConversion<int>();
        builder.Property(c => c.IsInternal).HasDefaultValue(true);

        builder.HasOne(c => c.Author)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => new { c.EntityType, c.EntityId })
            .HasDatabaseName("IX_Comments_Entity");

        builder.HasIndex(c => c.AuthorId).HasDatabaseName("IX_Comments_AuthorId");

        builder.HasQueryFilter(c => !c.IsDeleted);
    }
}
