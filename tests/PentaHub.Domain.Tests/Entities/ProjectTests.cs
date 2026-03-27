using FluentAssertions;
using PentaHub.Domain.Entities;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Tests.Entities;

public class ProjectTests
{
    [Fact]
    public void Status_DefaultsToBeklemede()
    {
        var project = new Project();

        project.Status.Should().Be(ProjectStatus.Beklemede);
    }

    [Fact]
    public void PrivacyLevel_DefaultsToAllEmployees()
    {
        var project = new Project();

        project.PrivacyLevel.Should().Be(PrivacyLevel.AllEmployees);
    }

    [Fact]
    public void IsBillable_DefaultsToFalse()
    {
        var project = new Project();

        project.IsBillable.Should().BeFalse();
    }

    [Fact]
    public void IsTemplate_DefaultsToFalse()
    {
        var project = new Project();

        project.IsTemplate.Should().BeFalse();
    }

    [Fact]
    public void CustomerEvaluation_DefaultsToNone()
    {
        var project = new Project();

        project.CustomerEvaluation.Should().Be(EvaluationType.None);
    }

    [Fact]
    public void Name_DefaultsToEmptyString()
    {
        var project = new Project();

        project.Name.Should().Be(string.Empty);
    }

    [Fact]
    public void NullableProperties_DefaultToNull()
    {
        var project = new Project();

        project.Description.Should().BeNull();
        project.ContactId.Should().BeNull();
        project.DepartmentName.Should().BeNull();
        project.StartDate.Should().BeNull();
        project.EndDate.Should().BeNull();
        project.ProjectEmail.Should().BeNull();
        project.SalesOrderId.Should().BeNull();
        project.EvaluationFrequency.Should().BeNull();
    }

    [Fact]
    public void NavigationCollections_AreInitialized()
    {
        var project = new Project();

        project.TaskStages.Should().NotBeNull().And.BeEmpty();
        project.Tasks.Should().NotBeNull().And.BeEmpty();
        project.Sprints.Should().NotBeNull().And.BeEmpty();
        project.Milestones.Should().NotBeNull().And.BeEmpty();
        project.ResourceAllocations.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var project = new Project
        {
            Name = "Test Project",
            Status = ProjectStatus.DevamEden,
            IsBillable = true,
            IsTemplate = true,
            PrivacyLevel = PrivacyLevel.InviteOnly
        };

        project.Name.Should().Be("Test Project");
        project.Status.Should().Be(ProjectStatus.DevamEden);
        project.IsBillable.Should().BeTrue();
        project.IsTemplate.Should().BeTrue();
        project.PrivacyLevel.Should().Be(PrivacyLevel.InviteOnly);
    }
}
