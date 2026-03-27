using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;

namespace PentaHub.Infrastructure.Data;

public class PentaHubDbContext : DbContext, IApplicationDbContext
{
    public PentaHubDbContext(DbContextOptions<PentaHubDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PentaHubDbContext).Assembly);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var now = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Buse Karapınar", Email = "buse.karapinar@pentahub.com", Role = "ProjectManager", Department = "Yazılım", IsActive = true, CreatedAt = now },
            new User { Id = 2, FullName = "Can Atem", Email = "can.atem@pentahub.com", Role = "ProjectManager", Department = "Satış", IsActive = true, CreatedAt = now },
            new User { Id = 3, FullName = "Osman Kaya", Email = "osman.kaya@pentahub.com", Role = "User", Department = "Yazılım", IsActive = true, CreatedAt = now },
            new User { Id = 4, FullName = "Ali Akın", Email = "ali.akin@pentahub.com", Role = "Admin", Department = "IT", IsActive = true, CreatedAt = now },
            new User { Id = 5, FullName = "Gizem Çiğer", Email = "gizem.ciger@pentahub.com", Role = "ProjectManager", Department = "Pazarlama", IsActive = true, CreatedAt = now }
        );

        modelBuilder.Entity<Project>().HasData(
            new Project { Id = 1, Name = "Acme Dijital Dönüşüm Projesi", Description = "Acme firmasının dijital dönüşüm süreçlerinin yönetimi", Status = ProjectStatus.DevamEden, ProjectManagerId = 1, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.ClientVisible, CreatedAt = now },
            new Project { Id = 2, Name = "CRM İmplementasyon", Description = "Müşteri ilişkileri yönetimi sistemi kurulumu", Status = ProjectStatus.DevamEden, ProjectManagerId = 2, DepartmentName = "Satış", IsBillable = true, StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 3, Name = "Mobil Uygulama Geliştirme", Description = "iOS ve Android platformları için mobil uygulama", Status = ProjectStatus.Beklemede, ProjectManagerId = 1, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 9, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.InviteOnly, CreatedAt = now },
            new Project { Id = 4, Name = "E-Ticaret Platform Entegrasyonu", Description = "Mevcut ERP sistemi ile e-ticaret platformu entegrasyonu", Status = ProjectStatus.DevamEden, ProjectManagerId = 5, DepartmentName = "IT", IsBillable = true, StartDate = new DateTime(2025, 1, 10, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 4, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 5, Name = "İç Eğitim Portalı", Description = "Şirket içi eğitim ve sertifikasyon platformu", Status = ProjectStatus.Tamamlandi, ProjectManagerId = 5, DepartmentName = "İK", IsBillable = false, StartDate = new DateTime(2024, 10, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 6, Name = "Veri Ambarı Modernizasyonu", Description = "Legacy veri ambarının bulut tabanlı çözüme taşınması", Status = ProjectStatus.Beklemede, ProjectManagerId = 4, DepartmentName = "IT", IsBillable = false, StartDate = new DateTime(2025, 5, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 12, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.InviteOnly, CreatedAt = now },
            new Project { Id = 7, Name = "Müşteri Portalı Yenileme", Description = "Müşteri self-servis portalının yeniden tasarlanması", Status = ProjectStatus.DevamEden, ProjectManagerId = 2, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 7, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.ClientVisible, CreatedAt = now },
            new Project { Id = 8, Name = "Pazarlama Otomasyon Projesi", Description = "Marketing automation araçlarının entegrasyonu ve kampanya yönetimi", Status = ProjectStatus.Beklemede, ProjectManagerId = 5, DepartmentName = "Pazarlama", IsBillable = false, StartDate = new DateTime(2025, 6, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 10, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now }
        );
    }

    public override int SaveChanges()
    {
        UpdateAuditFields();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries<Domain.Common.BaseEntity>();
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
