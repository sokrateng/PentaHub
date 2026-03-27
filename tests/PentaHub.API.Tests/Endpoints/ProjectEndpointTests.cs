using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Projects.Commands.CreateProject;
using PentaHub.Application.Projects.Commands.UpdateProject;
using PentaHub.Domain.Enums;

namespace PentaHub.API.Tests.Endpoints;

public class ProjectEndpointTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public ProjectEndpointTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProjects_ReturnsOkWithProjectList()
    {
        // Act
        var response = await _client.GetAsync("/api/projects");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<ProjectListDto>>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data.Should().HaveCountGreaterThanOrEqualTo(2);
    }

    [Fact]
    public async Task GetProjectById_ExistingId_ReturnsOkWithProject()
    {
        // Act
        var response = await _client.GetAsync("/api/projects/101");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Id.Should().Be(101);
        result.Data.Name.Should().Be("Test Projesi");
    }

    [Fact]
    public async Task GetProjectById_NonExistentId_ReturnsNotFound()
    {
        // Act
        var response = await _client.GetAsync("/api/projects/9999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateProject_ValidRequest_ReturnsCreatedWithProject()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "Yeni Test Projesi",
            Description = "API testi ile oluşturuldu",
            Status = ProjectStatus.Beklemede,
            ProjectManagerId = 101,
            DepartmentName = "Yazılım",
            IsBillable = true,
            PrivacyLevel = PrivacyLevel.AllEmployees
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Name.Should().Be("Yeni Test Projesi");
        result.Data.ProjectManagerId.Should().Be(101);
    }

    [Fact]
    public async Task CreateProject_EmptyName_ReturnsBadRequest()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "",
            ProjectManagerId = 1
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateProject_MissingProjectManager_ReturnsBadRequest()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "Geçerli İsim",
            ProjectManagerId = 0  // Invalid: must be > 0
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/projects", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateProject_ValidRequest_ReturnsOkWithUpdatedProject()
    {
        // Arrange
        // First create a project to update
        var createCommand = new CreateProjectCommand
        {
            Name = "Güncellenecek Proje",
            ProjectManagerId = 101,
            PrivacyLevel = PrivacyLevel.AllEmployees
        };
        var createResponse = await _client.PostAsJsonAsync("/api/projects", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<ProjectDto>>();
        var projectId = created!.Data!.Id;

        var updateCommand = new UpdateProjectCommand
        {
            Id = projectId,
            Name = "Güncellenmiş Proje",
            Status = ProjectStatus.DevamEden,
            ProjectManagerId = 101,
            PrivacyLevel = PrivacyLevel.AllEmployees
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/projects/{projectId}", updateCommand);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data!.Name.Should().Be("Güncellenmiş Proje");
        result.Data.Status.Should().Be(ProjectStatus.DevamEden);
    }

    [Fact]
    public async Task DeleteProject_ExistingId_ReturnsOk()
    {
        // Arrange
        var createCommand = new CreateProjectCommand
        {
            Name = "Silinecek Proje",
            ProjectManagerId = 101,
            PrivacyLevel = PrivacyLevel.AllEmployees
        };
        var createResponse = await _client.PostAsJsonAsync("/api/projects", createCommand);
        var created = await createResponse.Content.ReadFromJsonAsync<ApiResponse<ProjectDto>>();
        var projectId = created!.Data!.Id;

        // Act
        var response = await _client.DeleteAsync($"/api/projects/{projectId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<bool>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().BeTrue();
    }

    [Fact]
    public async Task GetProjectStats_ReturnsOkWithStats()
    {
        // Act
        var response = await _client.GetAsync("/api/projects/stats");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ProjectStatsDto>>();
        result.Should().NotBeNull();
        result!.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Total.Should().BeGreaterThanOrEqualTo(2);
    }
}
