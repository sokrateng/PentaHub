using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Tasks.Commands.CreateTask;

namespace PentaHub.API.Tests.Endpoints;

public class TaskEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TaskEndpointTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTasksByProject_ExistingProject_ReturnsOkWithKanbanData()
    {
        // Act
        var response = await _client.GetAsync("/api/projects/101/tasks");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<TaskKanbanDto>>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().HaveCountGreaterThanOrEqualTo(1);

        // Verify stages contain tasks
        var allTasks = result.Data!.SelectMany(s => s.Tasks).ToList();
        allTasks.Should().HaveCountGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task CreateTask_ValidRequest_ReturnsCreatedWithTask()
    {
        // Arrange
        var command = new CreateTaskCommand
        {
            Title = "Yeni Test Görevi",
            Description = "Test açıklaması",
            ProjectId = 101,
            AssigneeId = 101,
            Priority = 2,  // Medium
            IsBillable = true,
            PlannedHours = 8
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects/101/tasks", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectTaskDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Title.Should().Be("Yeni Test Görevi");
        result.Data.ProjectId.Should().Be(101);
    }

    [Fact]
    public async Task GetTaskById_ExistingTask_ReturnsOkWithTask()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/101");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectTaskDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Id.Should().Be(101);
        result.Data.Title.Should().Be("İlk Görev");
    }

    [Fact]
    public async Task GetTaskById_NonExistentTask_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/tasks/9999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task MoveTaskStage_ValidRequest_ReturnsOk()
    {
        // Arrange
        var body = new { StageId = 102 };

        // Act
        var response = await _client.PatchAsJsonAsync("/api/tasks/101/stage", body);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<bool>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().BeTrue();
    }
}
