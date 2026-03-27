using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PentaHub.Domain.Entities;

namespace PentaHub.Infrastructure.Data.Configurations;

public class ContactConfiguration : IEntityTypeConfiguration<Contact>
{
    public void Configure(EntityTypeBuilder<Contact> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.CompanyName).IsRequired().HasMaxLength(300);
        builder.Property(c => c.ContactPersonName).HasMaxLength(200);
        builder.Property(c => c.Email).HasMaxLength(200);
        builder.Property(c => c.Phone).HasMaxLength(50);
        builder.Property(c => c.Mobile).HasMaxLength(50);
        builder.Property(c => c.Website).HasMaxLength(300);
        builder.Property(c => c.Address).HasMaxLength(500);
        builder.Property(c => c.City).HasMaxLength(100);
        builder.Property(c => c.Country).HasMaxLength(100);
        builder.Property(c => c.Tags).HasMaxLength(500);

        builder.HasIndex(c => c.CompanyName).HasDatabaseName("IX_Contacts_CompanyName");

        builder.HasQueryFilter(c => !c.IsDeleted);
    }
}
