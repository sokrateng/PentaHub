using FluentAssertions;
using PentaHub.Domain.Entities;

namespace PentaHub.Domain.Tests.Entities;

public class TaskStageTests
{
    [Fact]
    public void ShowInKanban_DefaultsToTrue()
    {
        var stage = new TaskStage();

        stage.ShowInKanban.Should().BeTrue();
    }

    [Fact]
    public void IsDefault_DefaultsToFalse()
    {
        var stage = new TaskStage();

        stage.IsDefault.Should().BeFalse();
    }

    [Fact]
    public void IsClosedStage_DefaultsToFalse()
    {
        var stage = new TaskStage();

        stage.IsClosedStage.Should().BeFalse();
    }

    [Fact]
    public void Name_DefaultsToEmptyString()
    {
        var stage = new TaskStage();

        stage.Name.Should().Be(string.Empty);
    }

    [Fact]
    public void NavigationCollection_Tasks_IsInitialized()
    {
        var stage = new TaskStage();

        stage.Tasks.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var stage = new TaskStage
        {
            ProjectId = 5,
            Name = "In Review",
            SortOrder = 3,
            IsDefault = true,
            IsClosedStage = false,
            ShowInKanban = false
        };

        stage.ProjectId.Should().Be(5);
        stage.Name.Should().Be("In Review");
        stage.SortOrder.Should().Be(3);
        stage.IsDefault.Should().BeTrue();
        stage.IsClosedStage.Should().BeFalse();
        stage.ShowInKanban.Should().BeFalse();
    }
}
