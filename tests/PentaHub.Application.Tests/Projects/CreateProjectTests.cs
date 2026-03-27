using FluentAssertions;
using FluentValidation;
using PentaHub.Application.Projects.Commands.CreateProject;
using PentaHub.Application.Tests.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tests.Projects;

public class CreateProjectTests : IDisposable
{
    private readonly TestFixture _fixture;

    public CreateProjectTests()
    {
        _fixture = new TestFixture();
    }

    [Fact]
    public async Task Should_CreateProject_Successfully()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "New Integration Test Project",
            Description = "A project created during integration tests",
            Status = ProjectStatus.Beklemede,
            ProjectManagerId = TestFixture.UserId1,
            DepartmentName = "IT",
            IsBillable = true,
            StartDate = new DateTime(2025, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2025, 12, 31, 0, 0, 0, DateTimeKind.Utc),
            PrivacyLevel = PrivacyLevel.AllEmployees
        };

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be("New Integration Test Project");
        result.Description.Should().Be("A project created during integration tests");
        result.ProjectManagerId.Should().Be(TestFixture.UserId1);
        result.ProjectManagerName.Should().Be("Test User One");
        result.Status.Should().Be(ProjectStatus.Beklemede);
        result.IsBillable.Should().BeTrue();
        result.DepartmentName.Should().Be("IT");
    }

    [Fact]
    public async Task Should_FailValidation_WhenNameIsEmpty()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "",
            ProjectManagerId = TestFixture.UserId1
        };

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("*Proje adı zorunludur*");
    }

    [Fact]
    public async Task Should_FailValidation_WhenNameExceeds300Chars()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = new string('A', 301),
            ProjectManagerId = TestFixture.UserId1
        };

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("*300 karakter*");
    }

    [Fact]
    public async Task Should_FailValidation_WhenProjectManagerIdIsZero()
    {
        // Arrange
        var command = new CreateProjectCommand
        {
            Name = "Valid Project Name",
            ProjectManagerId = 0
        };

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("*Proje yöneticisi seçilmelidir*");
    }

    public void Dispose() => _fixture.Dispose();
}
