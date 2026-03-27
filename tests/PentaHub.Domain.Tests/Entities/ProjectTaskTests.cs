using FluentAssertions;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Tests.Entities;

public class ProjectTaskTests
{
    [Fact]
    public void Priority_DefaultsToNone()
    {
        var task = new ProjectTask();

        task.Priority.Should().Be(Priority.None);
    }

    [Fact]
    public void BusinessDaysOnly_DefaultsToTrue()
    {
        var task = new ProjectTask();

        task.BusinessDaysOnly.Should().BeTrue();
    }

    [Fact]
    public void IsBillable_DefaultsToFalse()
    {
        var task = new ProjectTask();

        task.IsBillable.Should().BeFalse();
    }

    [Fact]
    public void ProgressPercent_DefaultsToZero()
    {
        var task = new ProjectTask();

        task.ProgressPercent.Should().Be(0);
    }

    [Fact]
    public void PlannedHours_DefaultsToZero()
    {
        var task = new ProjectTask();

        task.PlannedHours.Should().Be(0m);
    }

    [Fact]
    public void SpentHours_DefaultsToZero()
    {
        var task = new ProjectTask();

        task.SpentHours.Should().Be(0m);
    }

    [Fact]
    public void RemainingHours_DefaultsToZero()
    {
        var task = new ProjectTask();

        task.RemainingHours.Should().Be(0m);
    }

    [Fact]
    public void StringDefaults_AreEmptyOrNull()
    {
        var task = new ProjectTask();

        task.TaskNumber.Should().Be(string.Empty);
        task.Title.Should().Be(string.Empty);
        task.Description.Should().BeNull();
        task.Tags.Should().BeNull();
    }

    [Fact]
    public void NullableForeignKeys_DefaultToNull()
    {
        var task = new ProjectTask();

        task.AssigneeId.Should().BeNull();
        task.SprintId.Should().BeNull();
        task.MilestoneId.Should().BeNull();
        task.ParentTaskId.Should().BeNull();
        task.StartDate.Should().BeNull();
        task.DueDate.Should().BeNull();
    }

    [Fact]
    public void NavigationCollections_AreInitialized()
    {
        var task = new ProjectTask();

        task.SubTasks.Should().NotBeNull().And.BeEmpty();
        task.Dependencies.Should().NotBeNull().And.BeEmpty();
        task.Dependents.Should().NotBeNull().And.BeEmpty();
        task.Checklists.Should().NotBeNull().And.BeEmpty();
        task.TimeSheets.Should().NotBeNull().And.BeEmpty();
        task.ResourceAllocations.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var task = new ProjectTask
        {
            Title = "Implement feature",
            Priority = Priority.High,
            ProgressPercent = 50,
            PlannedHours = 8m,
            BusinessDaysOnly = false,
            IsBillable = true
        };

        task.Title.Should().Be("Implement feature");
        task.Priority.Should().Be(Priority.High);
        task.ProgressPercent.Should().Be(50);
        task.PlannedHours.Should().Be(8m);
        task.BusinessDaysOnly.Should().BeFalse();
        task.IsBillable.Should().BeTrue();
    }
}
