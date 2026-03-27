using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Projects.Commands.DeleteProject;
using PentaHub.Application.Projects.Commands.UpdateProject;
using PentaHub.Application.Tests.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tests.Projects;

public class UpdateDeleteProjectTests : IDisposable
{
    private readonly TestFixture _fixture;

    public UpdateDeleteProjectTests()
    {
        _fixture = new TestFixture();
    }

    [Fact]
    public async Task Should_UpdateProject_Successfully()
    {
        // Arrange
        var command = new UpdateProjectCommand
        {
            Id = TestFixture.ProjectId1,
            Name = "Updated Project Alpha",
            Description = "Updated description",
            Status = ProjectStatus.Tamamlandi,
            ProjectManagerId = TestFixture.UserId2,
            DepartmentName = "Dev",
            IsBillable = false,
            PrivacyLevel = PrivacyLevel.InviteOnly
        };

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(TestFixture.ProjectId1);
        result.Name.Should().Be("Updated Project Alpha");
        result.Description.Should().Be("Updated description");
        result.Status.Should().Be(ProjectStatus.Tamamlandi);
        result.ProjectManagerId.Should().Be(TestFixture.UserId2);
        result.ProjectManagerName.Should().Be("Test User Two");
        result.IsBillable.Should().BeFalse();
    }

    [Fact]
    public async Task Should_SoftDeleteProject_WhenDeleted()
    {
        // Arrange
        var command = new DeleteProjectCommand(TestFixture.ProjectId1);

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().BeTrue();

        // Verify soft-delete flag is set in the database
        var context = _fixture.DbContext;
        var deletedProject = await context.Projects
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == TestFixture.ProjectId1);

        deletedProject.Should().NotBeNull();
        deletedProject!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task Should_ThrowKeyNotFoundException_WhenDeletingNonExistentProject()
    {
        // Arrange
        var command = new DeleteProjectCommand(9999);

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("*9999*");
    }

    public void Dispose() => _fixture.Dispose();
}
