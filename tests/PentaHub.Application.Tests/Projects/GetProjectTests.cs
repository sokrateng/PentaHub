using FluentAssertions;
using PentaHub.Application.Projects.Queries.GetProjectById;
using PentaHub.Application.Projects.Queries.GetProjectList;
using PentaHub.Application.Projects.Queries.GetProjectStats;
using PentaHub.Application.Tests.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tests.Projects;

public class GetProjectTests : IDisposable
{
    private readonly TestFixture _fixture;

    public GetProjectTests()
    {
        _fixture = new TestFixture();
    }

    [Fact]
    public async Task Should_ReturnProjectById_WhenProjectExists()
    {
        // Arrange
        var query = new GetProjectByIdQuery(TestFixture.ProjectId1);

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(TestFixture.ProjectId1);
        result.Name.Should().Be("Test Project Alpha");
        result.ProjectManagerId.Should().Be(TestFixture.UserId1);
        result.ProjectManagerName.Should().Be("Test User One");
        result.Status.Should().Be(ProjectStatus.DevamEden);
    }

    [Fact]
    public async Task Should_ReturnNull_ForNonExistentProject()
    {
        // Arrange
        var query = new GetProjectByIdQuery(9999);

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task Should_ReturnProjectList_WithPagination()
    {
        // Arrange
        var query = new GetProjectListQuery { Page = 1, PageSize = 10 };

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Count.Should().Be(2);
        result.Meta.Should().NotBeNull();
        result.Meta!.Total.Should().Be(2);
        result.Meta.Page.Should().Be(1);
        result.Meta.PageSize.Should().Be(10);
    }

    [Fact]
    public async Task Should_FilterProjectsByStatus()
    {
        // Arrange — only Project Alpha is DevamEden
        var query = new GetProjectListQuery
        {
            Status = ProjectStatus.DevamEden,
            Page = 1,
            PageSize = 50
        };

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Should().AllSatisfy(p => p.Status.Should().Be(ProjectStatus.DevamEden));
        result.Meta!.Total.Should().Be(1);
    }

    [Fact]
    public async Task Should_ReturnCorrectProjectStats()
    {
        // Arrange — seeded data: 1 DevamEden + 1 Beklemede = 2 total, 0 completed
        var query = new GetProjectStatsQuery();

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Total.Should().Be(2);
        result.Active.Should().Be(1);
        result.Waiting.Should().Be(1);
        result.Completed.Should().Be(0);
    }

    public void Dispose() => _fixture.Dispose();
}
