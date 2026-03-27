using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;
using PentaHub.Infrastructure.Data;

namespace PentaHub.API.Tests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"PentaHubTestDb_{Guid.NewGuid()}";
    private bool _seeded = false;
    private readonly object _seedLock = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove ALL EF Core DbContext registrations for PentaHubDbContext
            // This includes DbContextOptions<T>, the context type itself, IApplicationDbContext,
            // and the IDbContextOptionsConfiguration<T> registered by AddDbContext (SQLite config)
            var toRemove = services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<PentaHubDbContext>) ||
                    d.ServiceType == typeof(DbContextOptions) ||
                    d.ServiceType == typeof(PentaHubDbContext) ||
                    d.ServiceType == typeof(IApplicationDbContext) ||
                    d.ServiceType == typeof(IDbContextOptionsConfiguration<PentaHubDbContext>))
                .ToList();

            foreach (var descriptor in toRemove)
                services.Remove(descriptor);

            // Re-register with InMemory provider
            services.AddDbContext<PentaHubDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });

            services.AddScoped<IApplicationDbContext>(provider =>
                provider.GetRequiredService<PentaHubDbContext>());
        });

        builder.UseEnvironment("Development");
    }

    protected override void ConfigureClient(System.Net.Http.HttpClient client)
    {
        base.ConfigureClient(client);

        lock (_seedLock)
        {
            if (_seeded) return;
            using var scope = Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<PentaHubDbContext>();
            // Do NOT call EnsureCreated on InMemory - it would apply HasData() model seeds
            // from PentaHubDbContext.SeedData() which we don't want in tests.
            // InMemory DB is always ready without EnsureCreated.
            SeedTestData(db);
            _seeded = true;
        }
    }

    private static void SeedTestData(PentaHubDbContext db)
    {
        if (db.Users.Any())
            return;

        var now = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Use IDs that don't conflict with HasData model seeds
        // HasData seeds: Users 1-5, Projects 1-8, TaskStages 1-40, Tasks 1-15
        db.Users.AddRange(
            new User
            {
                Id = 101, FullName = "Test Manager", Email = "manager@test.com",
                Role = "ProjectManager", Department = "Yazılım", IsActive = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                CreatedAt = now
            },
            new User
            {
                Id = 102, FullName = "Test User", Email = "user@test.com",
                Role = "User", Department = "IT", IsActive = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                CreatedAt = now
            }
        );

        db.Projects.AddRange(
            new Project
            {
                Id = 101, Name = "Test Projesi", Description = "Integration test projesi",
                Status = ProjectStatus.DevamEden, ProjectManagerId = 101,
                DepartmentName = "Yazılım", IsBillable = true,
                StartDate = new DateTime(2025, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2025, 6, 30, 0, 0, 0, DateTimeKind.Utc),
                PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now
            },
            new Project
            {
                Id = 102, Name = "İkinci Proje", Description = "Beklemede proje",
                Status = ProjectStatus.Beklemede, ProjectManagerId = 102,
                DepartmentName = "IT", IsBillable = false,
                PrivacyLevel = PrivacyLevel.AllEmployees, CreatedAt = now
            }
        );

        db.TaskStages.AddRange(
            new TaskStage
            {
                Id = 101, ProjectId = 101, Name = "Yapılacak", SortOrder = 1,
                IsDefault = true, IsClosedStage = false, ShowInKanban = true, CreatedAt = now
            },
            new TaskStage
            {
                Id = 102, ProjectId = 101, Name = "Devam Etmekte", SortOrder = 2,
                IsDefault = false, IsClosedStage = false, ShowInKanban = true, CreatedAt = now
            },
            new TaskStage
            {
                Id = 103, ProjectId = 101, Name = "Bitti", SortOrder = 3,
                IsDefault = false, IsClosedStage = true, ShowInKanban = true, CreatedAt = now
            },
            new TaskStage
            {
                Id = 104, ProjectId = 102, Name = "Yapılacak", SortOrder = 1,
                IsDefault = true, IsClosedStage = false, ShowInKanban = true, CreatedAt = now
            }
        );

        db.ProjectTasks.AddRange(
            new ProjectTask
            {
                Id = 101, TaskNumber = "T0101", Title = "İlk Görev", ProjectId = 101, StageId = 101,
                AssigneeId = 101, Priority = Priority.High, IsBillable = true,
                PlannedHours = 8, SpentHours = 0, RemainingHours = 8,
                ProgressPercent = 0, SortOrder = 1, CreatedAt = now
            },
            new ProjectTask
            {
                Id = 102, TaskNumber = "T0102", Title = "İkinci Görev", ProjectId = 101, StageId = 102,
                AssigneeId = 102, Priority = Priority.Medium, IsBillable = false,
                PlannedHours = 4, SpentHours = 2, RemainingHours = 2,
                ProgressPercent = 50, SortOrder = 1, CreatedAt = now
            }
        );

        db.SaveChanges();
    }
}
