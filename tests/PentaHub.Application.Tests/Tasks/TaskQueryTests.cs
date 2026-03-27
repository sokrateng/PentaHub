using FluentAssertions;
using PentaHub.Application.Tasks.Queries.GetTaskById;
using PentaHub.Application.Tasks.Queries.GetTasksByProject;
using PentaHub.Application.Tests.Common;

namespace PentaHub.Application.Tests.Tasks;

public class TaskQueryTests : IDisposable
{
    private readonly TestFixture _fixture;

    public TaskQueryTests()
    {
        _fixture = new TestFixture();
    }

    [Fact]
    public async Task Should_ReturnTasksGroupedByStage_KanbanView()
    {
        // Arrange
        var query = new GetTasksByProjectQuery { ProjectId = TestFixture.ProjectId1, GroupByStage = true };

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();

        // Project 1 has 3 stages seeded
        result.Data!.Count.Should().Be(3);

        // Stages should be ordered by SortOrder
        var stageNames = result.Data.Select(s => s.StageName).ToList();
        stageNames.Should().ContainInOrder("Yapılacak", "Devam Etmekte", "Bitti");

        // "Yapılacak" stage has seeded task 1
        var firstStage = result.Data.First(s => s.StageName == "Yapılacak");
        firstStage.Tasks.Should().HaveCount(1);
        firstStage.Tasks.First().Title.Should().Be("Seeded Task 1");

        // "Devam Etmekte" stage has seeded task 2
        var secondStage = result.Data.First(s => s.StageName == "Devam Etmekte");
        secondStage.Tasks.Should().HaveCount(1);
        secondStage.Tasks.First().Title.Should().Be("Seeded Task 2");

        // "Bitti" stage should be empty
        var closedStage = result.Data.First(s => s.StageName == "Bitti");
        closedStage.Tasks.Should().BeEmpty();
    }

    [Fact]
    public async Task Should_ReturnTaskById_WithNavigations()
    {
        // Arrange
        var query = new GetTaskByIdQuery(TestFixture.TaskId1);

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(TestFixture.TaskId1);
        result.TaskNumber.Should().Be("T0001");
        result.Title.Should().Be("Seeded Task 1");
        result.ProjectId.Should().Be(TestFixture.ProjectId1);
        result.ProjectName.Should().Be("Test Project Alpha");
        result.StageId.Should().Be(TestFixture.StageId_P1_Todo);
        result.StageName.Should().Be("Yapılacak");
        result.SubTaskCount.Should().Be(0);
    }

    [Fact]
    public async Task Should_ReturnNull_ForNonExistentTaskId()
    {
        // Arrange
        var query = new GetTaskByIdQuery(9999);

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task Should_ReturnEmptyKanban_ForProjectWithNoTasks()
    {
        // Arrange — Project 2 has stages but no tasks seeded
        var query = new GetTasksByProjectQuery { ProjectId = TestFixture.ProjectId2, GroupByStage = true };

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Count.Should().Be(3);
        result.Data.Should().AllSatisfy(stage => stage.Tasks.Should().BeEmpty());
    }

    public void Dispose() => _fixture.Dispose();
}
