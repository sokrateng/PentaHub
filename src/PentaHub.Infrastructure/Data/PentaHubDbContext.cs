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
    public DbSet<TaskStage> TaskStages => Set<TaskStage>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<Sprint> Sprints => Set<Sprint>();

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

        // TaskStages seed - 5 stages per project, 8 projects = 40 stages total
        var stageNames = new[] {
            ("Yapılacak", 1, true, false),
            ("Analiz", 2, false, false),
            ("Devam Etmekte", 3, false, false),
            ("Test Yapmak", 4, false, false),
            ("Bitti", 5, false, true)
        };

        var taskStages = new List<TaskStage>();
        for (int projectId = 1; projectId <= 8; projectId++)
        {
            for (int s = 0; s < stageNames.Length; s++)
            {
                var (name, sortOrder, isDefault, isClosedStage) = stageNames[s];
                taskStages.Add(new TaskStage
                {
                    Id = (projectId - 1) * 5 + s + 1,
                    ProjectId = projectId,
                    Name = name,
                    SortOrder = sortOrder,
                    IsDefault = isDefault,
                    IsClosedStage = isClosedStage,
                    ShowInKanban = true,
                    CreatedAt = now
                });
            }
        }
        modelBuilder.Entity<TaskStage>().HasData(taskStages);

        // Sprint seed - 3 sprints for project 1
        modelBuilder.Entity<Sprint>().HasData(
            new Sprint { Id = 1, Name = "Mart Sprint I", ProjectId = 1, State = SprintState.Done, Goal = "Temel altyapı kurulumu", StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 2, Name = "Mart Sprint II", ProjectId = 1, State = SprintState.InProgress, Goal = "CRM modül entegrasyonu", StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 2, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 3, Name = "Nisan Sprint I", ProjectId = 1, State = SprintState.Draft, Goal = "Test ve go-live hazırlığı", StartDate = new DateTime(2025, 2, 16, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 2, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now }
        );

        // ProjectTasks seed - 15 tasks for project 1 "Acme Dijital Dönüşüm"
        // Stage IDs for project 1: Yapılacak=1, Analiz=2, Devam Etmekte=3, Test Yapmak=4, Bitti=5
        // SprintId: tasks 1-5 → Sprint 1, tasks 6-10 → Sprint 2, tasks 11-15 → null (backlog)
        modelBuilder.Entity<ProjectTask>().HasData(
            // Yapılacak (3 tasks) - Sprint 1
            new ProjectTask { Id = 1, TaskNumber = "T0001", Title = "CRM Modülünün Konfigürasyonu", ProjectId = 1, StageId = 1, AssigneeId = 1, SprintId = 1, Priority = Priority.High, IsBillable = true, PlannedHours = 16, SpentHours = 0, RemainingHours = 16, ProgressPercent = 0, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 2, TaskNumber = "T0002", Title = "Kullanıcı Rol ve Yetkileri Tanımlama", ProjectId = 1, StageId = 1, AssigneeId = 2, SprintId = 1, Priority = Priority.Medium, IsBillable = true, PlannedHours = 8, SpentHours = 0, RemainingHours = 8, ProgressPercent = 0, SortOrder = 2, StartDate = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 3, TaskNumber = "T0003", Title = "Veri Migrasyon Planı", ProjectId = 1, StageId = 1, AssigneeId = 3, SprintId = 1, Priority = Priority.Critical, IsBillable = true, PlannedHours = 24, SpentHours = 0, RemainingHours = 24, ProgressPercent = 0, SortOrder = 3, StartDate = new DateTime(2025, 1, 25, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Analiz (3 tasks) - Sprint 1 (tasks 4-5) and Sprint 2 (task 6)
            new ProjectTask { Id = 4, TaskNumber = "T0004", Title = "API Entegrasyon Geliştirme", ProjectId = 1, StageId = 2, AssigneeId = 4, SprintId = 1, Priority = Priority.High, IsBillable = true, PlannedHours = 40, SpentHours = 8, RemainingHours = 32, ProgressPercent = 20, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 5, TaskNumber = "T0005", Title = "UI/UX Tasarım Revizyonu", ProjectId = 1, StageId = 2, AssigneeId = 5, SprintId = 1, Priority = Priority.Medium, IsBillable = false, PlannedHours = 20, SpentHours = 4, RemainingHours = 16, ProgressPercent = 20, SortOrder = 2, StartDate = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 6, TaskNumber = "T0006", Title = "Güvenlik Denetimi", ProjectId = 1, StageId = 2, AssigneeId = 1, SprintId = 2, Priority = Priority.Critical, IsBillable = true, PlannedHours = 16, SpentHours = 6, RemainingHours = 10, ProgressPercent = 38, SortOrder = 3, StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Devam Etmekte (4 tasks) - Sprint 2
            new ProjectTask { Id = 7, TaskNumber = "T0007", Title = "Performans Testleri", ProjectId = 1, StageId = 3, AssigneeId = 2, SprintId = 2, Priority = Priority.Medium, IsBillable = true, PlannedHours = 24, SpentHours = 12, RemainingHours = 12, ProgressPercent = 50, SortOrder = 1, StartDate = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 8, TaskNumber = "T0008", Title = "Raporlama Modülü", ProjectId = 1, StageId = 3, AssigneeId = 3, SprintId = 2, Priority = Priority.High, IsBillable = true, PlannedHours = 32, SpentHours = 16, RemainingHours = 16, ProgressPercent = 50, SortOrder = 2, StartDate = new DateTime(2025, 2, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 9, TaskNumber = "T0009", Title = "Mobil Arayüz Geliştirme", ProjectId = 1, StageId = 3, AssigneeId = 4, SprintId = 2, Priority = Priority.Low, IsBillable = false, PlannedHours = 48, SpentHours = 20, RemainingHours = 28, ProgressPercent = 42, SortOrder = 3, StartDate = new DateTime(2025, 2, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 4, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 10, TaskNumber = "T0010", Title = "Veritabanı Optimizasyonu", ProjectId = 1, StageId = 3, AssigneeId = 5, SprintId = 2, Priority = Priority.Medium, IsBillable = true, PlannedHours = 16, SpentHours = 10, RemainingHours = 6, ProgressPercent = 63, SortOrder = 4, StartDate = new DateTime(2025, 2, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Test Yapmak (3 tasks) - Backlog (SprintId = null)
            new ProjectTask { Id = 11, TaskNumber = "T0011", Title = "Entegrasyon Testleri", ProjectId = 1, StageId = 4, AssigneeId = 1, Priority = Priority.High, IsBillable = true, PlannedHours = 20, SpentHours = 16, RemainingHours = 4, ProgressPercent = 80, SortOrder = 1, StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 12, TaskNumber = "T0012", Title = "Kullanıcı Kabul Testleri", ProjectId = 1, StageId = 4, AssigneeId = 2, Priority = Priority.High, IsBillable = true, PlannedHours = 16, SpentHours = 12, RemainingHours = 4, ProgressPercent = 75, SortOrder = 2, StartDate = new DateTime(2025, 3, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 25, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 13, TaskNumber = "T0013", Title = "Go-Live Planlaması", ProjectId = 1, StageId = 4, AssigneeId = 3, Priority = Priority.Critical, IsBillable = false, PlannedHours = 12, SpentHours = 8, RemainingHours = 4, ProgressPercent = 67, SortOrder = 3, StartDate = new DateTime(2025, 3, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Bitti (2 tasks) - Backlog (SprintId = null)
            new ProjectTask { Id = 14, TaskNumber = "T0014", Title = "Eğitim Materyalleri Hazırlama", ProjectId = 1, StageId = 5, AssigneeId = 4, Priority = Priority.Low, IsBillable = false, PlannedHours = 12, SpentHours = 12, RemainingHours = 0, ProgressPercent = 100, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 15, TaskNumber = "T0015", Title = "Dokümantasyon", ProjectId = 1, StageId = 5, AssigneeId = 5, Priority = Priority.None, IsBillable = false, PlannedHours = 8, SpentHours = 8, RemainingHours = 0, ProgressPercent = 100, SortOrder = 2, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now }
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
