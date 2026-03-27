using FluentAssertions;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Tests.Entities;

public class SprintTests
{
    [Fact]
    public void State_DefaultsToDraft()
    {
        var sprint = new Sprint();

        sprint.State.Should().Be(SprintState.Draft);
    }

    [Fact]
    public void Name_DefaultsToEmptyString()
    {
        var sprint = new Sprint();

        sprint.Name.Should().Be(string.Empty);
    }

    [Fact]
    public void Goal_DefaultsToNull()
    {
        var sprint = new Sprint();

        sprint.Goal.Should().BeNull();
    }

    [Fact]
    public void NavigationCollection_Tasks_IsInitialized()
    {
        var sprint = new Sprint();

        sprint.Tasks.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var start = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var end = new DateTime(2025, 1, 14, 0, 0, 0, DateTimeKind.Utc);

        var sprint = new Sprint
        {
            Name = "Sprint 1",
            ProjectId = 10,
            State = SprintState.InProgress,
            Goal = "Ship the MVP",
            StartDate = start,
            EndDate = end
        };

        sprint.Name.Should().Be("Sprint 1");
        sprint.ProjectId.Should().Be(10);
        sprint.State.Should().Be(SprintState.InProgress);
        sprint.Goal.Should().Be("Ship the MVP");
        sprint.StartDate.Should().Be(start);
        sprint.EndDate.Should().Be(end);
    }
}
