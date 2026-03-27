using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;
using PentaHub.Infrastructure.Data;

namespace PentaHub.Application.Tests.Common;

/// <summary>
/// Integration test fixture that wires up an InMemory PentaHubDbContext with
/// the full Application layer (MediatR, AutoMapper, FluentValidation).
///
/// ID ranges used in test seed data — chosen to avoid collision with
/// the production model seed in PentaHubDbContext.OnModelCreating:
///   Users:      seeded 1-5      → test uses 101, 102
///   Projects:   seeded 1-8      → test uses 101, 102
///   TaskStages: seeded 1-40     → test uses 101-106
///   Tasks:      seeded 1-15     → test uses 101, 102
///   Sprints:    seeded 1-3      → test uses 101
/// </summary>
public class TestFixture : IDisposable
{
    // Stable IDs accessible from test classes
    public const int UserId1 = 101;
    public const int UserId2 = 102;
    public const int ProjectId1 = 101;
    public const int ProjectId2 = 102;
    public const int StageId_P1_Todo = 101;
    public const int StageId_P1_InProgress = 102;
    public const int StageId_P1_Done = 103;
    public const int StageId_P2_Todo = 104;
    public const int StageId_P2_InProgress = 105;
    public const int StageId_P2_Done = 106;
    public const int TaskId1 = 101;
    public const int TaskId2 = 102;
    public const int SprintId1 = 101;

    public IServiceProvider ServiceProvider { get; }
    public IMediator Mediator => ServiceProvider.GetRequiredService<IMediator>();
    public IApplicationDbContext DbContext => ServiceProvider.GetRequiredService<IApplicationDbContext>();

    public TestFixture()
    {
        var services = new ServiceCollection();

        // Each fixture gets a unique InMemory database so tests are isolated
        var dbName = Guid.NewGuid().ToString();
        services.AddDbContext<PentaHubDbContext>(options =>
            options.UseInMemoryDatabase(dbName));

        services.AddScoped<IApplicationDbContext>(sp =>
            sp.GetRequiredService<PentaHubDbContext>());

        // MediatR requires ILoggerFactory
        services.AddLogging();

        // Register Application layer (MediatR, AutoMapper, FluentValidation, ValidationBehavior)
        services.AddApplication();

        // Stubs for services that the Application layer depends on but are irrelevant here
        services.AddScoped<IHubNotificationService, NullHubNotificationService>();
        services.AddScoped<IJwtService, NullJwtService>();

        ServiceProvider = services.BuildServiceProvider();

        SeedTestData();
    }

    private void SeedTestData()
    {
        // Use a separate scope so we get a fresh DbContext instance for seeding
        using var scope = ServiceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<PentaHubDbContext>();

        // InMemory provider does not need EnsureCreated() — calling it would execute
        // OnModelCreating seed data (IDs 1-N) which would then conflict with our test seeds.
        // We simply add entities directly with IDs that don't overlap the production seeds.

        var now = DateTime.UtcNow;

        context.Users.AddRange(
            new User { Id = UserId1, FullName = "Test User One", Email = "user1@test.com", Role = "ProjectManager", Department = "IT", IsActive = true, CreatedAt = now },
            new User { Id = UserId2, FullName = "Test User Two", Email = "user2@test.com", Role = "User", Department = "Dev", IsActive = true, CreatedAt = now }
        );

        context.Projects.AddRange(
            new Project
            {
                Id = ProjectId1,
                Name = "Test Project Alpha",
                Description = "First test project",
                Status = ProjectStatus.DevamEden,
                ProjectManagerId = UserId1,
                DepartmentName = "IT",
                IsBillable = true,
                StartDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2025, 12, 31, 0, 0, 0, DateTimeKind.Utc),
                PrivacyLevel = PrivacyLevel.AllEmployees,
                CreatedAt = now
            },
            new Project
            {
                Id = ProjectId2,
                Name = "Test Project Beta",
                Description = "Second test project",
                Status = ProjectStatus.Beklemede,
                ProjectManagerId = UserId2,
                DepartmentName = "Dev",
                IsBillable = false,
                StartDate = new DateTime(2025, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2025, 9, 30, 0, 0, 0, DateTimeKind.Utc),
                PrivacyLevel = PrivacyLevel.AllEmployees,
                CreatedAt = now
            }
        );

        // Task stages for Project 1
        context.TaskStages.AddRange(
            new TaskStage { Id = StageId_P1_Todo, ProjectId = ProjectId1, Name = "Yapılacak", SortOrder = 1, IsDefault = true, IsClosedStage = false, ShowInKanban = true, CreatedAt = now },
            new TaskStage { Id = StageId_P1_InProgress, ProjectId = ProjectId1, Name = "Devam Etmekte", SortOrder = 2, IsDefault = false, IsClosedStage = false, ShowInKanban = true, CreatedAt = now },
            new TaskStage { Id = StageId_P1_Done, ProjectId = ProjectId1, Name = "Bitti", SortOrder = 3, IsDefault = false, IsClosedStage = true, ShowInKanban = true, CreatedAt = now }
        );

        // Task stages for Project 2
        context.TaskStages.AddRange(
            new TaskStage { Id = StageId_P2_Todo, ProjectId = ProjectId2, Name = "Yapılacak", SortOrder = 1, IsDefault = true, IsClosedStage = false, ShowInKanban = true, CreatedAt = now },
            new TaskStage { Id = StageId_P2_InProgress, ProjectId = ProjectId2, Name = "Devam Etmekte", SortOrder = 2, IsDefault = false, IsClosedStage = false, ShowInKanban = true, CreatedAt = now },
            new TaskStage { Id = StageId_P2_Done, ProjectId = ProjectId2, Name = "Bitti", SortOrder = 3, IsDefault = false, IsClosedStage = true, ShowInKanban = true, CreatedAt = now }
        );

        // Tasks for Project 1 — both in backlog (SprintId = null)
        context.ProjectTasks.AddRange(
            new ProjectTask
            {
                Id = TaskId1,
                TaskNumber = "T0001",
                Title = "Seeded Task 1",
                ProjectId = ProjectId1,
                StageId = StageId_P1_Todo,
                Priority = Priority.High,
                SortOrder = 1,
                PlannedHours = 8,
                RemainingHours = 8,
                CreatedAt = now
            },
            new ProjectTask
            {
                Id = TaskId2,
                TaskNumber = "T0002",
                Title = "Seeded Task 2",
                ProjectId = ProjectId1,
                StageId = StageId_P1_InProgress,
                Priority = Priority.Medium,
                SortOrder = 1,
                PlannedHours = 4,
                RemainingHours = 4,
                SprintId = null,
                CreatedAt = now
            }
        );

        // Sprint for Project 1 in Draft state
        context.Sprints.Add(new Sprint
        {
            Id = SprintId1,
            Name = "Seeded Sprint 1",
            ProjectId = ProjectId1,
            State = SprintState.Draft,
            Goal = "Initial sprint",
            StartDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2025, 1, 14, 0, 0, 0, DateTimeKind.Utc),
            CreatedAt = now
        });

        context.SaveChanges();
    }

    public void Dispose()
    {
        if (ServiceProvider is IDisposable disposable)
            disposable.Dispose();
    }
}

internal class NullHubNotificationService : IHubNotificationService
{
    public Task SendCommentAddedAsync(string entityType, int entityId, PentaHub.Application.DTOs.CommentDto comment, CancellationToken cancellationToken = default)
        => Task.CompletedTask;
}

internal class NullJwtService : IJwtService
{
    public string GenerateToken(PentaHub.Domain.Entities.User user) => string.Empty;
    public string GenerateRefreshToken() => string.Empty;
    public bool ValidateRefreshToken(string token) => false;
}
