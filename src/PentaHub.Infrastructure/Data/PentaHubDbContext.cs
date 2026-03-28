using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;
using PentaHub.Domain.Common;
using CommentTypeEnum = PentaHub.Domain.Enums.CommentType;

namespace PentaHub.Infrastructure.Data;

public class PentaHubDbContext : DbContext, IApplicationDbContext
{
    public PentaHubDbContext(DbContextOptions<PentaHubDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<TaskStage> TaskStages => Set<TaskStage>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<Sprint> Sprints => Set<Sprint>();
    public DbSet<TaskDependency> TaskDependencies => Set<TaskDependency>();
    public DbSet<TaskChecklist> TaskChecklists => Set<TaskChecklist>();
    public DbSet<Milestone> Milestones => Set<Milestone>();
    public DbSet<ResourceAllocation> ResourceAllocations => Set<ResourceAllocation>();
    public DbSet<TimeSheet> TimeSheets => Set<TimeSheet>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Contact> Contacts => Set<Contact>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PentaHubDbContext).Assembly);

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        var now = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Contact>().HasData(
            new Contact { Id = 1, CompanyName = "Acme Corp", ContactPersonName = "John Smith", Email = "john.smith@acme.com", Phone = "+90 212 555 0101", City = "İstanbul", Country = "Türkiye", Tags = "müşteri,teknoloji", CreatedAt = now },
            new Contact { Id = 2, CompanyName = "TechVision Ltd", ContactPersonName = "Emily Johnson", Email = "emily.johnson@techvision.com", Phone = "+90 312 555 0202", City = "Ankara", Country = "Türkiye", Tags = "yazılım,partner", CreatedAt = now },
            new Contact { Id = 3, CompanyName = "GlobalTrade Inc", ContactPersonName = "Michael Brown", Email = "m.brown@globaltrade.com", Phone = "+90 232 555 0303", City = "İzmir", Country = "Türkiye", Tags = "ticaret,ihracat", CreatedAt = now },
            new Contact { Id = 4, CompanyName = "DataSoft Bilişim", ContactPersonName = "Ayşe Kaya", Email = "ayse.kaya@datasoft.com.tr", Phone = "+90 216 555 0404", Mobile = "+90 532 555 0404", City = "İstanbul", Country = "Türkiye", Website = "https://www.datasoft.com.tr", Tags = "yazılım,veri", CreatedAt = now },
            new Contact { Id = 5, CompanyName = "MegaRetail A.Ş.", ContactPersonName = "Mehmet Demir", Email = "mehmet.demir@megaretail.com.tr", Phone = "+90 224 555 0505", Mobile = "+90 542 555 0505", City = "Bursa", Country = "Türkiye", Website = "https://www.megaretail.com.tr", Tags = "perakende,e-ticaret", CreatedAt = now }
        );

        // BCrypt hash for "demo123"
        var demoPasswordHash = "$2b$10$xk.p2GDylG0KP3WpW7CF7.cgjHfkbU1tgy4QvJtUd/xjxYhQHTU02";

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, FullName = "Buse Karapınar", Email = "buse.karapinar@pentahub.com", PasswordHash = demoPasswordHash, Role = "ProjectManager", Department = "Yazılım", IsActive = true, CreatedAt = now },
            new User { Id = 2, FullName = "Can Atem", Email = "can.atem@pentahub.com", PasswordHash = demoPasswordHash, Role = "ProjectManager", Department = "Satış", IsActive = true, CreatedAt = now },
            new User { Id = 3, FullName = "Osman Kaya", Email = "osman.kaya@pentahub.com", PasswordHash = demoPasswordHash, Role = "User", Department = "Yazılım", IsActive = true, CreatedAt = now },
            new User { Id = 4, FullName = "Ali Akın", Email = "ali.akin@pentahub.com", PasswordHash = demoPasswordHash, Role = "Admin", Department = "IT", IsActive = true, CreatedAt = now },
            new User { Id = 5, FullName = "Gizem Çiğer", Email = "gizem.ciger@pentahub.com", PasswordHash = demoPasswordHash, Role = "ProjectManager", Department = "Pazarlama", IsActive = true, CreatedAt = now },
            new User { Id = 6, FullName = "Admin User", Email = "admin@pentahub.com", PasswordHash = demoPasswordHash, Role = "Admin", Department = "IT", IsActive = true, CreatedAt = now },
            new User { Id = 7, FullName = "Demo User", Email = "demo@pentahub.com", PasswordHash = demoPasswordHash, Role = "User", Department = "Yazılım", IsActive = true, CreatedAt = now },
            new User { Id = 8, FullName = "Yasemin Kaya", Email = "yasemin.kaya@pentahub.com", PasswordHash = demoPasswordHash, Role = "ProjectManager", Department = "Finans", IsActive = true, CreatedAt = now }
        );

        modelBuilder.Entity<Project>().HasData(
            new Project { Id = 1, Name = "Acme Dijital Dönüşüm Projesi", Description = "Acme firmasının dijital dönüşüm süreçlerinin yönetimi", Status = ProjectStatus.DevamEden, ProjectManagerId = 1, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.ClientVisible, CreatedAt = now },
            new Project { Id = 2, Name = "CRM İmplementasyon", Description = "Müşteri ilişkileri yönetimi sistemi kurulumu", Status = ProjectStatus.DevamEden, ProjectManagerId = 2, DepartmentName = "Satış", IsBillable = true, StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 3, Name = "Mobil Uygulama Geliştirme", Description = "iOS ve Android platformları için mobil uygulama", Status = ProjectStatus.Beklemede, ProjectManagerId = 1, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 9, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.InviteOnly, CreatedAt = now },
            new Project { Id = 4, Name = "E-Ticaret Platform Entegrasyonu", Description = "Mevcut ERP sistemi ile e-ticaret platformu entegrasyonu", Status = ProjectStatus.DevamEden, ProjectManagerId = 5, DepartmentName = "IT", IsBillable = true, StartDate = new DateTime(2025, 1, 10, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 4, 30, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 5, Name = "İç Eğitim Portalı", Description = "Şirket içi eğitim ve sertifikasyon platformu", Status = ProjectStatus.Tamamlandi, ProjectManagerId = 5, DepartmentName = "İK", IsBillable = false, StartDate = new DateTime(2024, 10, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 6, Name = "Veri Ambarı Modernizasyonu", Description = "Legacy veri ambarının bulut tabanlı çözüme taşınması", Status = ProjectStatus.Beklemede, ProjectManagerId = 4, DepartmentName = "IT", IsBillable = false, StartDate = new DateTime(2025, 5, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 12, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.InviteOnly, CreatedAt = now },
            new Project { Id = 7, Name = "Müşteri Portalı Yenileme", Description = "Müşteri self-servis portalının yeniden tasarlanması", Status = ProjectStatus.DevamEden, ProjectManagerId = 2, DepartmentName = "Yazılım", IsBillable = true, StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 7, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.ClientVisible, CreatedAt = now },
            new Project { Id = 8, Name = "Pazarlama Otomasyon Projesi", Description = "Marketing automation araçlarının entegrasyonu ve kampanya yönetimi", Status = ProjectStatus.Beklemede, ProjectManagerId = 5, DepartmentName = "Pazarlama", IsBillable = false, StartDate = new DateTime(2025, 6, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 10, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now },
            new Project { Id = 9, Name = "Penta BMS - Bütçe Yönetim Sistemi", Description = "IBM Cognos TM1 alternatifi, SAP FI/CO/SD entegrasyonlu bütçe yönetim sistemi. 3 fazlı geliştirme: Satış & OPEX, IFRS Finansal Tablolar, Net Kâr Dağıtım Modeli. Claude AI destekli geliştirme.", Status = ProjectStatus.DevamEden, ProjectManagerId = 8, DepartmentName = "Finans", IsBillable = true, StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), PrivacyLevel = PrivacyLevel.InviteOnly, CreatedAt = now }
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
        for (int projectId = 1; projectId <= 9; projectId++)
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
            new Sprint { Id = 3, Name = "Nisan Sprint I", ProjectId = 1, State = SprintState.Draft, Goal = "Test ve go-live hazırlığı", StartDate = new DateTime(2025, 2, 16, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 2, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 4, Name = "BMS Hazırlık Sprint", ProjectId = 9, State = SprintState.Done, Goal = ".NET modül entegrasyonu, SAP RFC bağlantı testi, kullanıcı eğitimi", StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 5, Name = "BMS Faz 1 - Satış & OPEX", ProjectId = 9, State = SprintState.InProgress, Goal = "Net Satış, Brüt Kâr, SDD — İş Birimi & Marka bazlı, SAP SD entegrasyonu", StartDate = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 7, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 6, Name = "BMS Faz 2 - IFRS Tablolar", ProjectId = 9, State = SprintState.Draft, Goal = "IFRS mizan, Gelir Tablosu, Bilanço, Nakit Akış, NİS takibi", StartDate = new DateTime(2026, 7, 16, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 9, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new Sprint { Id = 7, Name = "BMS Faz 3 - Net Kâr Modeli", ProjectId = 9, State = SprintState.Draft, Goal = "NİS dağıtım modeli, vergi dağıtımı, İB Net Kâr, marka kârlılık matrisi", StartDate = new DateTime(2026, 9, 16, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now }
        );

        // Milestones seed - 4 milestones for project 1
        modelBuilder.Entity<Milestone>().HasData(
            new Milestone { Id = 1, ProjectId = 1, Name = "Faz 1 - Altyapı", TargetDate = new DateTime(2025, 2, 28, 0, 0, 0, DateTimeKind.Utc), SortOrder = 1, CreatedAt = now },
            new Milestone { Id = 2, ProjectId = 1, Name = "Faz 2 - Geliştirme", TargetDate = new DateTime(2025, 4, 30, 0, 0, 0, DateTimeKind.Utc), SortOrder = 2, CreatedAt = now },
            new Milestone { Id = 3, ProjectId = 1, Name = "Faz 3 - Test", TargetDate = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc), SortOrder = 3, CreatedAt = now },
            new Milestone { Id = 4, ProjectId = 1, Name = "Faz 4 - Go-Live", TargetDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc), SortOrder = 4, CreatedAt = now },
            new Milestone { Id = 5, ProjectId = 9, Name = "Hazırlık & Altyapı Tamamlanması", TargetDate = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc), SortOrder = 1, CreatedAt = now },
            new Milestone { Id = 6, ProjectId = 9, Name = "Faz 1 - Satış & OPEX Go-Live", TargetDate = new DateTime(2026, 7, 15, 0, 0, 0, DateTimeKind.Utc), SortOrder = 2, CreatedAt = now },
            new Milestone { Id = 7, ProjectId = 9, Name = "Faz 2 - IFRS Raporlama Go-Live", TargetDate = new DateTime(2026, 9, 15, 0, 0, 0, DateTimeKind.Utc), SortOrder = 3, CreatedAt = now },
            new Milestone { Id = 8, ProjectId = 9, Name = "Faz 3 - Net Kâr Modeli Go-Live", TargetDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), SortOrder = 4, CreatedAt = now },
            new Milestone { Id = 9, ProjectId = 9, Name = "Yönetim Kurulu Sunumu & Final Onay", TargetDate = new DateTime(2026, 11, 15, 0, 0, 0, DateTimeKind.Utc), SortOrder = 5, CreatedAt = now }
        );

        // ProjectTasks seed - 15 tasks for project 1 "Acme Dijital Dönüşüm"
        // Stage IDs for project 1: Yapılacak=1, Analiz=2, Devam Etmekte=3, Test Yapmak=4, Bitti=5
        // SprintId: tasks 1-5 → Sprint 1, tasks 6-10 → Sprint 2, tasks 11-15 → null (backlog)
        // MilestoneId: tasks 1-4 → Milestone 1, tasks 5-8 → Milestone 2, tasks 9-12 → Milestone 3, tasks 13-15 → Milestone 4
        modelBuilder.Entity<ProjectTask>().HasData(
            // Yapılacak (3 tasks) - Sprint 1
            new ProjectTask { Id = 1, TaskNumber = "T0001", Title = "CRM Modülünün Konfigürasyonu", ProjectId = 1, StageId = 1, AssigneeId = 1, SprintId = 1, MilestoneId = 1, Priority = Priority.High, IsBillable = true, PlannedHours = 16, SpentHours = 0, RemainingHours = 16, ProgressPercent = 0, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 2, TaskNumber = "T0002", Title = "Kullanıcı Rol ve Yetkileri Tanımlama", ProjectId = 1, StageId = 1, AssigneeId = 2, SprintId = 1, MilestoneId = 1, Priority = Priority.Medium, IsBillable = true, PlannedHours = 8, SpentHours = 0, RemainingHours = 8, ProgressPercent = 0, SortOrder = 2, StartDate = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 3, TaskNumber = "T0003", Title = "Veri Migrasyon Planı", ProjectId = 1, StageId = 1, AssigneeId = 3, SprintId = 1, MilestoneId = 1, Priority = Priority.Critical, IsBillable = true, PlannedHours = 24, SpentHours = 0, RemainingHours = 24, ProgressPercent = 0, SortOrder = 3, StartDate = new DateTime(2025, 1, 25, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Analiz (3 tasks) - Sprint 1 (tasks 4-5) and Sprint 2 (task 6)
            new ProjectTask { Id = 4, TaskNumber = "T0004", Title = "API Entegrasyon Geliştirme", ProjectId = 1, StageId = 2, AssigneeId = 4, SprintId = 1, MilestoneId = 1, Priority = Priority.High, IsBillable = true, PlannedHours = 40, SpentHours = 8, RemainingHours = 32, ProgressPercent = 20, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 5, TaskNumber = "T0005", Title = "UI/UX Tasarım Revizyonu", ProjectId = 1, StageId = 2, AssigneeId = 5, SprintId = 1, MilestoneId = 2, Priority = Priority.Medium, IsBillable = false, PlannedHours = 20, SpentHours = 4, RemainingHours = 16, ProgressPercent = 20, SortOrder = 2, StartDate = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 6, TaskNumber = "T0006", Title = "Güvenlik Denetimi", ProjectId = 1, StageId = 2, AssigneeId = 1, SprintId = 2, MilestoneId = 2, Priority = Priority.Critical, IsBillable = true, PlannedHours = 16, SpentHours = 6, RemainingHours = 10, ProgressPercent = 38, SortOrder = 3, StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Devam Etmekte (4 tasks) - Sprint 2
            new ProjectTask { Id = 7, TaskNumber = "T0007", Title = "Performans Testleri", ProjectId = 1, StageId = 3, AssigneeId = 2, SprintId = 2, MilestoneId = 2, Priority = Priority.Medium, IsBillable = true, PlannedHours = 24, SpentHours = 12, RemainingHours = 12, ProgressPercent = 50, SortOrder = 1, StartDate = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 8, TaskNumber = "T0008", Title = "Raporlama Modülü", ProjectId = 1, StageId = 3, AssigneeId = 3, SprintId = 2, MilestoneId = 2, Priority = Priority.High, IsBillable = true, PlannedHours = 32, SpentHours = 16, RemainingHours = 16, ProgressPercent = 50, SortOrder = 2, StartDate = new DateTime(2025, 2, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 9, TaskNumber = "T0009", Title = "Mobil Arayüz Geliştirme", ProjectId = 1, StageId = 3, AssigneeId = 4, SprintId = 2, MilestoneId = 3, Priority = Priority.Low, IsBillable = false, PlannedHours = 48, SpentHours = 20, RemainingHours = 28, ProgressPercent = 42, SortOrder = 3, StartDate = new DateTime(2025, 2, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 4, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 10, TaskNumber = "T0010", Title = "Veritabanı Optimizasyonu", ProjectId = 1, StageId = 3, AssigneeId = 5, SprintId = 2, MilestoneId = 3, Priority = Priority.Medium, IsBillable = true, PlannedHours = 16, SpentHours = 10, RemainingHours = 6, ProgressPercent = 63, SortOrder = 4, StartDate = new DateTime(2025, 2, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Test Yapmak (3 tasks) - Backlog (SprintId = null)
            new ProjectTask { Id = 11, TaskNumber = "T0011", Title = "Entegrasyon Testleri", ProjectId = 1, StageId = 4, AssigneeId = 1, MilestoneId = 3, Priority = Priority.High, IsBillable = true, PlannedHours = 20, SpentHours = 16, RemainingHours = 4, ProgressPercent = 80, SortOrder = 1, StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 12, TaskNumber = "T0012", Title = "Kullanıcı Kabul Testleri", ProjectId = 1, StageId = 4, AssigneeId = 2, MilestoneId = 3, Priority = Priority.High, IsBillable = true, PlannedHours = 16, SpentHours = 12, RemainingHours = 4, ProgressPercent = 75, SortOrder = 2, StartDate = new DateTime(2025, 3, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 3, 25, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 13, TaskNumber = "T0013", Title = "Go-Live Planlaması", ProjectId = 1, StageId = 4, AssigneeId = 3, MilestoneId = 4, Priority = Priority.Critical, IsBillable = false, PlannedHours = 12, SpentHours = 8, RemainingHours = 4, ProgressPercent = 67, SortOrder = 3, StartDate = new DateTime(2025, 3, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Bitti (2 tasks) - Backlog (SprintId = null)
            new ProjectTask { Id = 14, TaskNumber = "T0014", Title = "Eğitim Materyalleri Hazırlama", ProjectId = 1, StageId = 5, AssigneeId = 4, MilestoneId = 4, Priority = Priority.Low, IsBillable = false, PlannedHours = 12, SpentHours = 12, RemainingHours = 0, ProgressPercent = 100, SortOrder = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 15, TaskNumber = "T0015", Title = "Dokümantasyon", ProjectId = 1, StageId = 5, AssigneeId = 5, MilestoneId = 4, Priority = Priority.None, IsBillable = false, PlannedHours = 8, SpentHours = 8, RemainingHours = 0, ProgressPercent = 100, SortOrder = 2, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2025, 1, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Penta BMS - Hazırlık fazı (Sprint 4, Milestone 5) — Stage IDs for project 9: Yapılacak=41, Analiz=42, Devam Etmekte=43, Test Yapmak=44, Bitti=45
            new ProjectTask { Id = 16, TaskNumber = "BMS-001", Title = ".NET Proje Altyapısı Kurulumu", ProjectId = 9, StageId = 45, AssigneeId = 4, SprintId = 4, MilestoneId = 5, Priority = Priority.Critical, IsBillable = true, PlannedHours = 24, SpentHours = 24, RemainingHours = 0, ProgressPercent = 100, SortOrder = 1, StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 4, 7, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 17, TaskNumber = "BMS-002", Title = "SAP RFC Bağlantı Testi (FI/CO/SD)", ProjectId = 9, StageId = 45, AssigneeId = 3, SprintId = 4, MilestoneId = 5, Priority = Priority.Critical, IsBillable = true, PlannedHours = 32, SpentHours = 32, RemainingHours = 0, ProgressPercent = 100, SortOrder = 2, StartDate = new DateTime(2026, 4, 7, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 4, 14, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 18, TaskNumber = "BMS-003", Title = "SQL Server Veritabanı Şeması Tasarımı", ProjectId = 9, StageId = 45, AssigneeId = 4, SprintId = 4, MilestoneId = 5, Priority = Priority.High, IsBillable = true, PlannedHours = 20, SpentHours = 20, RemainingHours = 0, ProgressPercent = 100, SortOrder = 3, StartDate = new DateTime(2026, 4, 8, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 19, TaskNumber = "BMS-004", Title = "Kullanıcı Rol & Yetki Matrisi Tanımlama", ProjectId = 9, StageId = 45, AssigneeId = 8, SprintId = 4, MilestoneId = 5, Priority = Priority.Medium, IsBillable = false, PlannedHours = 8, SpentHours = 8, RemainingHours = 0, ProgressPercent = 100, SortOrder = 4, StartDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 4, 18, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 20, TaskNumber = "BMS-005", Title = "UAT Ortamı Hazırlığı & Eğitim Planı", ProjectId = 9, StageId = 45, AssigneeId = 1, SprintId = 4, MilestoneId = 5, Priority = Priority.Medium, IsBillable = false, PlannedHours = 12, SpentHours = 12, RemainingHours = 0, ProgressPercent = 100, SortOrder = 5, StartDate = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 4, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Penta BMS - Faz 1 Satış & OPEX (Sprint 5, Milestone 6)
            new ProjectTask { Id = 21, TaskNumber = "BMS-006", Title = "Dashboard & KPI Kartları Geliştirme", ProjectId = 9, StageId = 44, AssigneeId = 4, SprintId = 5, MilestoneId = 6, Priority = Priority.High, IsBillable = true, PlannedHours = 40, SpentHours = 32, RemainingHours = 8, ProgressPercent = 80, SortOrder = 1, StartDate = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 22, TaskNumber = "BMS-007", Title = "Aylık Bütçe Giriş Modülü (Excel/CSP/Manuel)", ProjectId = 9, StageId = 43, AssigneeId = 3, SprintId = 5, MilestoneId = 6, Priority = Priority.Critical, IsBillable = true, PlannedHours = 48, SpentHours = 28, RemainingHours = 20, ProgressPercent = 58, SortOrder = 2, StartDate = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 6, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 23, TaskNumber = "BMS-008", Title = "SAP SD → Satış Verisi Otomatik Entegrasyon", ProjectId = 9, StageId = 43, AssigneeId = 3, SprintId = 5, MilestoneId = 6, Priority = Priority.Critical, IsBillable = true, PlannedHours = 56, SpentHours = 20, RemainingHours = 36, ProgressPercent = 36, SortOrder = 3, StartDate = new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 6, 20, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 24, TaskNumber = "BMS-009", Title = "SAP FI-CO → Fiili Veri Aktarımı", ProjectId = 9, StageId = 42, AssigneeId = 4, SprintId = 5, MilestoneId = 6, Priority = Priority.High, IsBillable = true, PlannedHours = 40, SpentHours = 10, RemainingHours = 30, ProgressPercent = 25, SortOrder = 4, StartDate = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 6, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 25, TaskNumber = "BMS-010", Title = "Bütçe/Gerçekleşme Karşılaştırma Raporları", ProjectId = 9, StageId = 42, AssigneeId = 7, SprintId = 5, MilestoneId = 6, Priority = Priority.High, IsBillable = true, PlannedHours = 32, SpentHours = 5, RemainingHours = 27, ProgressPercent = 16, SortOrder = 5, StartDate = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 6, 25, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 26, TaskNumber = "BMS-011", Title = "4 Adımlı Onay İş Akışı (Workflow)", ProjectId = 9, StageId = 41, AssigneeId = 4, SprintId = 5, MilestoneId = 6, Priority = Priority.Medium, IsBillable = true, PlannedHours = 24, SpentHours = 0, RemainingHours = 24, ProgressPercent = 0, SortOrder = 6, StartDate = new DateTime(2026, 6, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 7, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 27, TaskNumber = "BMS-012", Title = "Senaryo Yönetimi (Baz/İyimser/Kötümser)", ProjectId = 9, StageId = 41, AssigneeId = 3, SprintId = 5, MilestoneId = 6, Priority = Priority.Medium, IsBillable = true, PlannedHours = 20, SpentHours = 0, RemainingHours = 20, ProgressPercent = 0, SortOrder = 7, StartDate = new DateTime(2026, 6, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 7, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 28, TaskNumber = "BMS-013", Title = "Döviz Kur Yönetimi & TCMB Entegrasyonu", ProjectId = 9, StageId = 41, AssigneeId = 7, SprintId = 5, MilestoneId = 6, Priority = Priority.High, IsBillable = true, PlannedHours = 16, SpentHours = 0, RemainingHours = 16, ProgressPercent = 0, SortOrder = 8, StartDate = new DateTime(2026, 6, 25, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 7, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Penta BMS - Faz 2 IFRS (Sprint 6, Milestone 7)
            new ProjectTask { Id = 29, TaskNumber = "BMS-014", Title = "SAP IFRS Mizan Verisi Aktarımı", ProjectId = 9, StageId = 41, AssigneeId = 3, SprintId = 6, MilestoneId = 7, Priority = Priority.Critical, IsBillable = true, PlannedHours = 40, SpentHours = 0, RemainingHours = 40, ProgressPercent = 0, SortOrder = 1, StartDate = new DateTime(2026, 7, 16, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 8, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 30, TaskNumber = "BMS-015", Title = "IFRS Gelir Tablosu Modülü", ProjectId = 9, StageId = 41, AssigneeId = 4, SprintId = 6, MilestoneId = 7, Priority = Priority.High, IsBillable = true, PlannedHours = 36, SpentHours = 0, RemainingHours = 36, ProgressPercent = 0, SortOrder = 2, StartDate = new DateTime(2026, 8, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 8, 25, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 31, TaskNumber = "BMS-016", Title = "Bilanço & Nakit Akış Raporlaması", ProjectId = 9, StageId = 41, AssigneeId = 7, SprintId = 6, MilestoneId = 7, Priority = Priority.High, IsBillable = true, PlannedHours = 32, SpentHours = 0, RemainingHours = 32, ProgressPercent = 0, SortOrder = 3, StartDate = new DateTime(2026, 8, 10, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 32, TaskNumber = "BMS-017", Title = "Net İşletme Sermayesi (NİS) Takip Modülü", ProjectId = 9, StageId = 41, AssigneeId = 4, SprintId = 6, MilestoneId = 7, Priority = Priority.Medium, IsBillable = true, PlannedHours = 24, SpentHours = 0, RemainingHours = 24, ProgressPercent = 0, SortOrder = 4, StartDate = new DateTime(2026, 8, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 9, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 33, TaskNumber = "BMS-018", Title = "Net Finansal Borç İzleme Paneli", ProjectId = 9, StageId = 41, AssigneeId = 3, SprintId = 6, MilestoneId = 7, Priority = Priority.Medium, IsBillable = true, PlannedHours = 16, SpentHours = 0, RemainingHours = 16, ProgressPercent = 0, SortOrder = 5, StartDate = new DateTime(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 9, 12, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Penta BMS - Faz 3 Net Kâr (Sprint 7, Milestone 8)
            new ProjectTask { Id = 34, TaskNumber = "BMS-019", Title = "NİS Bazlı Finansman Gideri Dağıtım Anahtarları", ProjectId = 9, StageId = 41, AssigneeId = 8, SprintId = 7, MilestoneId = 8, Priority = Priority.High, IsBillable = true, PlannedHours = 32, SpentHours = 0, RemainingHours = 32, ProgressPercent = 0, SortOrder = 1, StartDate = new DateTime(2026, 9, 16, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 10, 5, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 35, TaskNumber = "BMS-020", Title = "Vergi Gideri İB & Marka Bazlı Dağıtım", ProjectId = 9, StageId = 41, AssigneeId = 3, SprintId = 7, MilestoneId = 8, Priority = Priority.High, IsBillable = true, PlannedHours = 24, SpentHours = 0, RemainingHours = 24, ProgressPercent = 0, SortOrder = 2, StartDate = new DateTime(2026, 10, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 36, TaskNumber = "BMS-021", Title = "İş Birimi Bazlı Net Kâr Hesaplama Motoru", ProjectId = 9, StageId = 41, AssigneeId = 4, SprintId = 7, MilestoneId = 8, Priority = Priority.Critical, IsBillable = true, PlannedHours = 40, SpentHours = 0, RemainingHours = 40, ProgressPercent = 0, SortOrder = 3, StartDate = new DateTime(2026, 10, 5, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 10, 25, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 37, TaskNumber = "BMS-022", Title = "Marka Bazlı Kârlılık Matrisi", ProjectId = 9, StageId = 41, AssigneeId = 7, SprintId = 7, MilestoneId = 8, Priority = Priority.Medium, IsBillable = true, PlannedHours = 20, SpentHours = 0, RemainingHours = 20, ProgressPercent = 0, SortOrder = 4, StartDate = new DateTime(2026, 10, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 10, 28, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            // Penta BMS - Cross-cutting tasks (no sprint, Milestone 9)
            new ProjectTask { Id = 38, TaskNumber = "BMS-023", Title = "KVKK & ISO 27001 Uyumluluk Denetimi", ProjectId = 9, StageId = 42, AssigneeId = 8, MilestoneId = 9, Priority = Priority.High, IsBillable = false, PlannedHours = 16, SpentHours = 4, RemainingHours = 12, ProgressPercent = 25, SortOrder = 1, StartDate = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 39, TaskNumber = "BMS-024", Title = "IBM TM1 → Penta BMS Veri Migrasyon Planı", ProjectId = 9, StageId = 43, AssigneeId = 1, MilestoneId = 9, Priority = Priority.Medium, IsBillable = false, PlannedHours = 24, SpentHours = 12, RemainingHours = 12, ProgressPercent = 50, SortOrder = 2, StartDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 6, 30, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now },
            new ProjectTask { Id = 40, TaskNumber = "BMS-025", Title = "Yönetim Kurulu Final Sunumu Hazırlığı", ProjectId = 9, StageId = 41, AssigneeId = 8, MilestoneId = 9, Priority = Priority.Low, IsBillable = false, PlannedHours = 8, SpentHours = 0, RemainingHours = 8, ProgressPercent = 0, SortOrder = 3, StartDate = new DateTime(2026, 10, 20, 0, 0, 0, DateTimeKind.Utc), DueDate = new DateTime(2026, 11, 10, 0, 0, 0, DateTimeKind.Utc), CreatedAt = now }
        );

        // TaskChecklists seed - 5 items for Task 1 "CRM Modülünün Konfigürasyonu"
        modelBuilder.Entity<TaskChecklist>().HasData(
            new TaskChecklist { Id = 1, TaskId = 1, Title = "Veritabanı şemasını hazırla", IsCompleted = true, SortOrder = 1, CreatedAt = now },
            new TaskChecklist { Id = 2, TaskId = 1, Title = "API endpoint'leri tanımla", IsCompleted = true, SortOrder = 2, CreatedAt = now },
            new TaskChecklist { Id = 3, TaskId = 1, Title = "Frontend formları oluştur", IsCompleted = false, SortOrder = 3, CreatedAt = now },
            new TaskChecklist { Id = 4, TaskId = 1, Title = "Test senaryoları yaz", IsCompleted = false, SortOrder = 4, CreatedAt = now },
            new TaskChecklist { Id = 5, TaskId = 1, Title = "Dokümantasyonu güncelle", IsCompleted = false, SortOrder = 5, CreatedAt = now },
            // BMS-002 SAP RFC Test (Task 17)
            new TaskChecklist { Id = 6, TaskId = 17, Title = "Z_BMS_GET_FI_ACTUAL RFC testi", IsCompleted = true, SortOrder = 1, CreatedAt = now },
            new TaskChecklist { Id = 7, TaskId = 17, Title = "Z_BMS_GET_SD_SALES RFC testi", IsCompleted = true, SortOrder = 2, CreatedAt = now },
            new TaskChecklist { Id = 8, TaskId = 17, Title = "Z_BMS_GET_CO_COSTCENTER RFC testi", IsCompleted = true, SortOrder = 3, CreatedAt = now },
            new TaskChecklist { Id = 9, TaskId = 17, Title = "Z_BMS_POST_BUDGET RFC testi", IsCompleted = true, SortOrder = 4, CreatedAt = now },
            new TaskChecklist { Id = 10, TaskId = 17, Title = "Z_BMS_GET_FX_RATES RFC testi", IsCompleted = true, SortOrder = 5, CreatedAt = now },
            // BMS-006 Dashboard (Task 21)
            new TaskChecklist { Id = 11, TaskId = 21, Title = "6 KPI kartı tasarımı", IsCompleted = true, SortOrder = 1, CreatedAt = now },
            new TaskChecklist { Id = 12, TaskId = 21, Title = "Trend grafikleri (bütçe vs fiili)", IsCompleted = true, SortOrder = 2, CreatedAt = now },
            new TaskChecklist { Id = 13, TaskId = 21, Title = "İş birimi dağılımı donut chart", IsCompleted = true, SortOrder = 3, CreatedAt = now },
            new TaskChecklist { Id = 14, TaskId = 21, Title = "OPEX ilerleme renk kodları", IsCompleted = false, SortOrder = 4, CreatedAt = now },
            new TaskChecklist { Id = 15, TaskId = 21, Title = "Onay bildirimleri özeti", IsCompleted = false, SortOrder = 5, CreatedAt = now },
            // BMS-007 Bütçe Giriş (Task 22)
            new TaskChecklist { Id = 16, TaskId = 22, Title = "12 aylık giriş tablosu UI", IsCompleted = true, SortOrder = 1, CreatedAt = now },
            new TaskChecklist { Id = 17, TaskId = 22, Title = "Excel import desteği", IsCompleted = true, SortOrder = 2, CreatedAt = now },
            new TaskChecklist { Id = 18, TaskId = 22, Title = "CSP (Cost Center Planning) entegrasyonu", IsCompleted = false, SortOrder = 3, CreatedAt = now },
            new TaskChecklist { Id = 19, TaskId = 22, Title = "Senaryo & departman seçici", IsCompleted = false, SortOrder = 4, CreatedAt = now },
            // BMS-023 KVKK (Task 38)
            new TaskChecklist { Id = 20, TaskId = 38, Title = "Veri sınıflandırma raporu", IsCompleted = true, SortOrder = 1, CreatedAt = now },
            new TaskChecklist { Id = 21, TaskId = 38, Title = "Audit log mekanizması", IsCompleted = false, SortOrder = 2, CreatedAt = now },
            new TaskChecklist { Id = 22, TaskId = 38, Title = "Kullanıcı erişim logları", IsCompleted = false, SortOrder = 3, CreatedAt = now },
            new TaskChecklist { Id = 23, TaskId = 38, Title = "Veri saklama politikası", IsCompleted = false, SortOrder = 4, CreatedAt = now }
        );

        // TaskDependencies seed
        // Task 4 depends on Task 1 (FinishToStart)
        // Task 7 depends on Task 3 (FinishToStart)
        // Task 13 depends on Task 6 (FinishToStart)
        modelBuilder.Entity<TaskDependency>().HasData(
            new TaskDependency { Id = 1, TaskId = 4, DependsOnTaskId = 1, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 2, TaskId = 7, DependsOnTaskId = 3, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 3, TaskId = 13, DependsOnTaskId = 6, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            // BMS task dependencies
            new TaskDependency { Id = 4, TaskId = 22, DependsOnTaskId = 18, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 5, TaskId = 23, DependsOnTaskId = 17, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 6, TaskId = 24, DependsOnTaskId = 17, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 7, TaskId = 29, DependsOnTaskId = 24, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 8, TaskId = 34, DependsOnTaskId = 32, DependencyType = DependencyType.FinishToStart, CreatedAt = now },
            new TaskDependency { Id = 9, TaskId = 36, DependsOnTaskId = 35, DependencyType = DependencyType.FinishToStart, CreatedAt = now }
        );

        // ResourceAllocations seed - 5 allocations for project 1 (users 1-5)
        modelBuilder.Entity<ResourceAllocation>().HasData(
            new ResourceAllocation { Id = 1, UserId = 1, ProjectId = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 3, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 6, TotalHours = 264, Notes = "Proje Yöneticisi tam zamanlı tahsis", CreatedAt = now },
            new ResourceAllocation { Id = 2, UserId = 2, ProjectId = 1, StartDate = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 4, 30, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 8, TotalHours = 480, Notes = "Backend geliştirici tam zamanlı", CreatedAt = now },
            new ResourceAllocation { Id = 3, UserId = 3, ProjectId = 1, StartDate = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 5, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 4, TotalHours = 320, Notes = "Kıdemli geliştirici yarı zamanlı", CreatedAt = now },
            new ResourceAllocation { Id = 4, UserId = 4, ProjectId = 1, StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 5, TotalHours = 550, Notes = "IT uzmanı proje süresince", CreatedAt = now },
            new ResourceAllocation { Id = 5, UserId = 5, ProjectId = 1, StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 7, TotalHours = 560, Notes = "Pazarlama & test uzmanı", CreatedAt = now },
            // BMS project resource allocations
            new ResourceAllocation { Id = 6, UserId = 8, ProjectId = 9, StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 6, TotalHours = 780, Notes = "Proje Yöneticisi & İş Analisti — CIO/COO Yasemin K.", CreatedAt = now },
            new ResourceAllocation { Id = 7, UserId = 4, ProjectId = 9, StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 8, TotalHours = 1040, Notes = "Kıdemli .NET Geliştirici — Full-stack", CreatedAt = now },
            new ResourceAllocation { Id = 8, UserId = 3, ProjectId = 9, StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 8, TotalHours = 1040, Notes = "SAP ABAP/RFC Uzmanı — Entegrasyon geliştirici", CreatedAt = now },
            new ResourceAllocation { Id = 9, UserId = 7, ProjectId = 9, StartDate = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 10, 31, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 4, TotalHours = 520, Notes = "Frontend Geliştirici — Raporlama & UI", CreatedAt = now },
            new ResourceAllocation { Id = 10, UserId = 1, ProjectId = 9, StartDate = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc), EndDate = new DateTime(2026, 7, 15, 0, 0, 0, DateTimeKind.Utc), HoursPerDay = 3, TotalHours = 195, Notes = "QA & Test Uzmanı — UAT koordinasyonu", CreatedAt = now }
        );

        // Comments seed - 5 comments for project 1 (mix of Note and SystemLog types)
        modelBuilder.Entity<Comment>().HasData(
            new Comment { Id = 1, EntityType = "Project", EntityId = 1, AuthorId = 1, Content = "<p>Proje başlangıç toplantısı gerçekleştirildi. Tüm ekip üyeleri görevlerini teslim aldı.</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = now },
            new Comment { Id = 2, EntityType = "Project", EntityId = 1, AuthorId = 2, Content = "<p>Müşteri ile sprint planlaması görüşmesi yapıldı. Öncelikli özellikler belirlendi.</p>", CommentType = CommentTypeEnum.Note, IsInternal = false, CreatedAt = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 3, EntityType = "Project", EntityId = 1, AuthorId = 1, Content = "<p>Proje durumu: DevamEden olarak güncellendi.</p>", CommentType = CommentTypeEnum.SystemLog, IsInternal = true, CreatedAt = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 4, EntityType = "Project", EntityId = 1, AuthorId = 3, Content = "<p>Haftalık durum toplantısı yapıldı. API entegrasyon geliştirme %20 tamamlandı.</p>", CommentType = CommentTypeEnum.Meeting, IsInternal = true, CreatedAt = new DateTime(2025, 1, 25, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 5, EntityType = "Project", EntityId = 1, AuthorId = 4, Content = "<p>Veri migrasyon planı onaylandı. Geliştirme ekibi bilgilendirildi.</p>", CommentType = CommentTypeEnum.SystemLog, IsInternal = true, CreatedAt = new DateTime(2025, 2, 1, 0, 0, 0, DateTimeKind.Utc) },
            // BMS project comments
            new Comment { Id = 6, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p><strong>Proje Kick-off Toplantısı</strong></p><p>Penta BMS projesi resmi olarak başlatıldı. 3 fazlı geliştirme planı onaylandı. IBM Cognos TM1 alternatifi olarak geliştirilecek.</p><p>Katılımcılar: Yasemin K. (CIO), Ali Akın (IT), Osman Kaya (SAP), Demo User (Frontend)</p>", CommentType = CommentTypeEnum.Meeting, IsInternal = true, CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 7, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p>📄 <strong>Yönetici Sunumu</strong> (PPTX)<br/>Penta BMS Bütçe Yönetim Sistemi yönetici sunumu. Proje kapsamı, 3 faz planı, teknik mimari, maliyet analizi ve IBM TM1 karşılaştırması.</p><p>🔗 penta-bms-yonetici-sunumu.pptx</p>", CommentType = CommentTypeEnum.Note, IsInternal = false, CreatedAt = new DateTime(2026, 3, 28, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 8, EntityType = "Project", EntityId = 9, AuthorId = 4, Content = "<p>📄 <strong>Teknik Mimari Dökümanı</strong> (PDF)<br/>.NET uygulama katmanları, SQL Server şeması, SAP RFC Gateway yapısı, KVKK/ISO 27001 uyumluluk gereksinimleri.</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 4, 5, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 9, EntityType = "Project", EntityId = 9, AuthorId = 3, Content = "<p><strong>SAP RFC Erişim Durumu</strong></p><p>5 adet Z_BMS_* RFC fonksiyonu SAP Basis ekibi tarafından açıldı. Tüm bağlantı testleri başarılı.</p><ul><li>Z_BMS_GET_FI_ACTUAL ✅</li><li>Z_BMS_GET_SD_SALES ✅</li><li>Z_BMS_GET_CO_COSTCENTER ✅</li><li>Z_BMS_POST_BUDGET ✅</li><li>Z_BMS_GET_FX_RATES ✅</li></ul>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 4, 14, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 10, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p>📄 <strong>Maliyet & ROI Analizi</strong> (XLSX)<br/>Faz bazlı maliyet tahmini: Toplam ₺1.35M–₺2.2M. IBM TM1 karşılaştırması: ₺6M–₺11M tasarruf. Kaynak kodu Penta'ya ait.</p>", CommentType = CommentTypeEnum.Note, IsInternal = false, CreatedAt = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 11, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p><strong>Haftalık Durum Toplantısı #4</strong></p><p>Hazırlık fazı tamamlandı. Faz 1 geliştirme başladı. Dashboard %80, Bütçe Giriş %58, SAP SD enteg. %36 ilerleme.</p><p>Risk: SAP SD veri kalitesi düşük — veri temizleme gerekiyor.</p>", CommentType = CommentTypeEnum.Meeting, IsInternal = true, CreatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 12, EntityType = "Project", EntityId = 9, AuthorId = 1, Content = "<p>Proje durumu: DevamEden olarak güncellendi. Hazırlık fazı başarıyla tamamlandı.</p>", CommentType = CommentTypeEnum.SystemLog, IsInternal = true, CreatedAt = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc) },
            // BMS task-level comments
            new Comment { Id = 13, EntityType = "Task", EntityId = 21, AuthorId = 4, Content = "<p>Dashboard KPI kartları ve trend grafikleri tamamlandı. OPEX renk kodları ve onay bildirimleri kaldı.</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 14, EntityType = "Task", EntityId = 23, AuthorId = 3, Content = "<p>SAP SD verilerinde tutarsızlık bulundu. Basis ekibi ile koordinasyon gerekiyor. Veri temizleme için 1 hafta ek süre talep ediyorum.</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 5, 25, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 15, EntityType = "Task", EntityId = 17, AuthorId = 3, Content = "<p>Tüm 5 RFC fonksiyonu başarıyla test edildi. Performans metrikleri:<br/>- FI_ACTUAL: avg 1.2s<br/>- SD_SALES: avg 0.8s<br/>- CO_COSTCENTER: avg 0.5s<br/>- POST_BUDGET: avg 2.1s<br/>- FX_RATES: avg 0.3s</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 4, 13, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 16, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p><strong>HAND-OVER: Hazırlık → Faz 1 Geçiş Notu</strong></p><p>Tamamlanan işler:</p><ul><li>.NET proje altyapısı kuruldu (Clean Architecture)</li><li>SQL Server şeması tasarlandı ve oluşturuldu</li><li>5 SAP RFC fonksiyonu test edildi — tümü başarılı</li><li>Kullanıcı yetki matrisi tanımlandı (4 rol)</li><li>UAT ortamı hazırlandı</li></ul><p>Faz 1'e aktarılan riskler:</p><ul><li>SAP SD veri kalitesi — temizleme gerekiyor</li><li>Excel import için standart şablon oluşturulmalı</li></ul><p>Faz 1 öncelikleri: Dashboard, Bütçe Giriş, SAP SD/FI-CO entegrasyonu</p>", CommentType = CommentTypeEnum.Note, IsInternal = true, CreatedAt = new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Comment { Id = 17, EntityType = "Project", EntityId = 9, AuthorId = 8, Content = "<p><strong>Konu:</strong> BMS Faz 1 İlerleme Raporu — Finans Departmanı<br/><strong>Kime:</strong> CFO, Finans Ekibi<br/><strong>Tarih:</strong> 20 Mayıs 2026</p><p>Değerli Yöneticiler,</p><p>Penta BMS Faz 1 geliştirme süreci planlandığı şekilde ilerlemektedir. Dashboard modülü %80, Bütçe Giriş modülü %58 tamamlanmıştır. Haziran sonuna kadar SAP SD ve FI-CO entegrasyonlarının tamamlanması hedeflenmektedir.</p>", CommentType = CommentTypeEnum.Email, IsInternal = false, CreatedAt = new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc) }
        );

        // TimeSheets seed - 10 entries for various tasks in project 1
        modelBuilder.Entity<TimeSheet>().HasData(
            new TimeSheet { Id = 1, UserId = 1, TaskId = 4, Date = new DateTime(2025, 1, 20, 0, 0, 0, DateTimeKind.Utc), Hours = 4, Description = "API tasarım toplantısı ve dokümantasyon", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 2, UserId = 1, TaskId = 4, Date = new DateTime(2025, 1, 21, 0, 0, 0, DateTimeKind.Utc), Hours = 4, Description = "API endpoint geliştirme", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 3, UserId = 2, TaskId = 7, Date = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc), Hours = 6, Description = "Yük testi senaryoları hazırlama", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 4, UserId = 2, TaskId = 7, Date = new DateTime(2025, 2, 6, 0, 0, 0, DateTimeKind.Utc), Hours = 6, Description = "Yük testi çalıştırma ve analiz", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 5, UserId = 3, TaskId = 8, Date = new DateTime(2025, 2, 10, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Raporlama modülü mimari tasarım", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 6, UserId = 3, TaskId = 8, Date = new DateTime(2025, 2, 11, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Raporlama bileşenleri geliştirme", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 7, UserId = 5, TaskId = 5, Date = new DateTime(2025, 1, 22, 0, 0, 0, DateTimeKind.Utc), Hours = 4, Description = "UI mockup hazırlama", IsBillable = false, CreatedAt = now },
            new TimeSheet { Id = 8, UserId = 4, TaskId = 9, Date = new DateTime(2025, 2, 18, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Mobil ekranlar geliştirme", IsBillable = false, CreatedAt = now },
            new TimeSheet { Id = 9, UserId = 5, TaskId = 10, Date = new DateTime(2025, 2, 22, 0, 0, 0, DateTimeKind.Utc), Hours = 5, Description = "Sorgu optimizasyonu", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 10, UserId = 1, TaskId = 6, Date = new DateTime(2025, 2, 3, 0, 0, 0, DateTimeKind.Utc), Hours = 6, Description = "Güvenlik açığı tarama ve raporlama", IsBillable = true, CreatedAt = now },
            // BMS timesheets
            new TimeSheet { Id = 11, UserId = 4, TaskId = 16, Date = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = ".NET Clean Architecture proje yapısı oluşturma", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 12, UserId = 4, TaskId = 16, Date = new DateTime(2026, 4, 2, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "NuGet paketleri, DI ve middleware konfigürasyonu", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 13, UserId = 4, TaskId = 16, Date = new DateTime(2026, 4, 3, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "SAP RFC connector entegrasyonu ve test", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 14, UserId = 3, TaskId = 17, Date = new DateTime(2026, 4, 7, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Z_BMS_GET_FI_ACTUAL ve Z_BMS_GET_SD_SALES RFC testi", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 15, UserId = 3, TaskId = 17, Date = new DateTime(2026, 4, 8, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Z_BMS_GET_CO_COSTCENTER ve Z_BMS_POST_BUDGET RFC testi", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 16, UserId = 3, TaskId = 17, Date = new DateTime(2026, 4, 9, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Z_BMS_GET_FX_RATES testi ve performans ölçümü", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 17, UserId = 3, TaskId = 17, Date = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "RFC hata yönetimi ve retry mekanizması", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 18, UserId = 4, TaskId = 18, Date = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Bütçe, senaryo, hesap planı tabloları tasarımı", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 19, UserId = 4, TaskId = 21, Date = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "KPI kartları ve trend grafikleri geliştirme", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 20, UserId = 4, TaskId = 21, Date = new DateTime(2026, 5, 8, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "İş birimi dağılımı ve donut chart", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 21, UserId = 3, TaskId = 22, Date = new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "Aylık bütçe giriş formu backend API", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 22, UserId = 3, TaskId = 23, Date = new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc), Hours = 8, Description = "SAP SD veri mapping ve dönüşüm kuralları", IsBillable = true, CreatedAt = now },
            new TimeSheet { Id = 23, UserId = 8, TaskId = 38, Date = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc), Hours = 4, Description = "KVKK veri sınıflandırma raporu hazırlama", IsBillable = false, CreatedAt = now },
            new TimeSheet { Id = 24, UserId = 1, TaskId = 39, Date = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc), Hours = 6, Description = "IBM TM1 mevcut veri yapısı analizi", IsBillable = false, CreatedAt = now },
            new TimeSheet { Id = 25, UserId = 1, TaskId = 39, Date = new DateTime(2026, 4, 25, 0, 0, 0, DateTimeKind.Utc), Hours = 6, Description = "Veri migrasyon stratejisi ve mapping dökümanı", IsBillable = false, CreatedAt = now }
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
