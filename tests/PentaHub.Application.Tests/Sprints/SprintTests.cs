using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Sprints.Commands.AssignTaskToSprint;
using PentaHub.Application.Sprints.Commands.ChangeSprintState;
using PentaHub.Application.Sprints.Commands.CreateSprint;
using PentaHub.Application.Sprints.Queries.GetBacklog;
using PentaHub.Application.Tests.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Tests.Sprints;

public class SprintTests : IDisposable
{
    private readonly TestFixture _fixture;

    public SprintTests()
    {
        _fixture = new TestFixture();
    }

    [Fact]
    public async Task Should_CreateSprint_Successfully()
    {
        // Arrange
        var command = new CreateSprintCommand
        {
            Name = "New Sprint From Test",
            ProjectId = TestFixture.ProjectId1,
            Goal = "Complete core features",
            StartDate = new DateTime(2025, 4, 1, 0, 0, 0, DateTimeKind.Utc),
            EndDate = new DateTime(2025, 4, 14, 0, 0, 0, DateTimeKind.Utc)
        };

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().BeGreaterThan(0);
        result.Name.Should().Be("New Sprint From Test");
        result.ProjectId.Should().Be(TestFixture.ProjectId1);
        result.ProjectName.Should().Be("Test Project Alpha");
        result.Goal.Should().Be("Complete core features");
        result.State.Should().Be(SprintState.Draft);
        result.TaskCount.Should().Be(0);
        result.CompletedTaskCount.Should().Be(0);
    }

    [Fact]
    public async Task Should_ChangeSprintState_FromDraftToInProgress()
    {
        // Arrange — seeded sprint is in Draft state
        var command = new ChangeSprintStateCommand(SprintId: TestFixture.SprintId1, NewState: SprintState.InProgress);

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(TestFixture.SprintId1);
        result.State.Should().Be(SprintState.InProgress);
        result.StateText.Should().Be("Devam Eden");
    }

    [Fact]
    public async Task Should_ChangeSprintState_FromInProgressToDone()
    {
        // Arrange — first step: Draft → InProgress
        await _fixture.Mediator.Send(new ChangeSprintStateCommand(TestFixture.SprintId1, SprintState.InProgress));

        // Second step: InProgress → Done
        var command = new ChangeSprintStateCommand(SprintId: TestFixture.SprintId1, NewState: SprintState.Done);

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().NotBeNull();
        result.State.Should().Be(SprintState.Done);
        result.StateText.Should().Be("Tamamlandı");
    }

    [Fact]
    public async Task Should_RejectInvalidStateTransition_DoneToDraft()
    {
        // Arrange — advance to Done first
        await _fixture.Mediator.Send(new ChangeSprintStateCommand(TestFixture.SprintId1, SprintState.InProgress));
        await _fixture.Mediator.Send(new ChangeSprintStateCommand(TestFixture.SprintId1, SprintState.Done));

        // Attempt to revert Done → Draft
        var command = new ChangeSprintStateCommand(SprintId: TestFixture.SprintId1, NewState: SprintState.Draft);

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Geçersiz durum geçişi*");
    }

    [Fact]
    public async Task Should_RejectInvalidStateTransition_DraftToDone()
    {
        // Arrange — sprint is Draft, try skipping directly to Done
        var command = new ChangeSprintStateCommand(SprintId: TestFixture.SprintId1, NewState: SprintState.Done);

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Geçersiz durum geçişi*");
    }

    [Fact]
    public async Task Should_AssignTask_ToSprint()
    {
        // Arrange — TaskId2 currently has SprintId = null
        var command = new AssignTaskToSprintCommand(SprintId: TestFixture.SprintId1, TaskId: TestFixture.TaskId2);

        // Act
        var result = await _fixture.Mediator.Send(command);

        // Assert
        result.Should().BeTrue();

        // Verify the SprintId was updated in the database
        var context = _fixture.DbContext;
        var task = await context.ProjectTasks.FirstAsync(t => t.Id == TestFixture.TaskId2);
        task.SprintId.Should().Be(TestFixture.SprintId1);
    }

    [Fact]
    public async Task Should_ThrowKeyNotFoundException_WhenAssigningToNonExistentSprint()
    {
        // Arrange
        var command = new AssignTaskToSprintCommand(SprintId: 9999, TaskId: TestFixture.TaskId1);

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("*Sprint bulunamadı*");
    }

    [Fact]
    public async Task Should_ReturnBacklogTasks_WithSprintIdNull()
    {
        // Arrange — both seeded tasks have SprintId = null
        var query = new GetBacklogQuery(ProjectId: TestFixture.ProjectId1);

        // Act
        var result = await _fixture.Mediator.Send(query);

        // Assert
        result.Should().NotBeNull();
        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Should().HaveCount(2, "both seeded tasks are in the backlog (SprintId = null)");
        result.Data.Should().AllSatisfy(t => t.SprintId.Should().BeNull());
    }

    [Fact]
    public async Task Should_ReturnOnlyRemainingBacklogTasks_AfterOneTaskAssignedToSprint()
    {
        // Arrange — assign task 1 to sprint so only task 2 remains in backlog
        await _fixture.Mediator.Send(new AssignTaskToSprintCommand(TestFixture.SprintId1, TestFixture.TaskId1));

        // Act
        var result = await _fixture.Mediator.Send(new GetBacklogQuery(TestFixture.ProjectId1));

        // Assert
        result.Should().NotBeNull();
        result.Data.Should().NotBeNull();
        result.Data!.Should().HaveCount(1, "task 1 is now in sprint, only task 2 remains in backlog");
        result.Data.First().Id.Should().Be(TestFixture.TaskId2);
    }

    [Fact]
    public async Task Should_ThrowKeyNotFoundException_WhenChangingStateOfNonExistentSprint()
    {
        // Arrange
        var command = new ChangeSprintStateCommand(SprintId: 9999, NewState: SprintState.InProgress);

        // Act
        var act = () => _fixture.Mediator.Send(command);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("*Sprint bulunamadı*");
    }

    public void Dispose() => _fixture.Dispose();
}
