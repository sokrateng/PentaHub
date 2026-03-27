using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.FullName).IsRequired().HasMaxLength(200);
        builder.Property(u => u.Email).IsRequired().HasMaxLength(200);
        builder.Property(u => u.PasswordHash).HasMaxLength(500);
        builder.Property(u => u.AvatarUrl).HasMaxLength(500);
        builder.Property(u => u.Role).IsRequired().HasMaxLength(50).HasDefaultValue("User");
        builder.Property(u => u.Department).HasMaxLength(100);
        builder.Property(u => u.IsActive).HasDefaultValue(true);
        builder.Property(u => u.RefreshToken).HasMaxLength(500);
        builder.Property(u => u.RefreshTokenExpiryTime);

        builder.HasIndex(u => u.Email).IsUnique();
        builder.HasQueryFilter(u => !u.IsDeleted);
    }
}
