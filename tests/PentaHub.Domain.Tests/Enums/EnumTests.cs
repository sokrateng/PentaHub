using FluentAssertions;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Tests.Enums;

public class EnumTests
{
    // ProjectStatus
    [Fact]
    public void ProjectStatus_Beklemede_HasValue0()
    {
        ((int)ProjectStatus.Beklemede).Should().Be(0);
    }

    [Fact]
    public void ProjectStatus_DevamEden_HasValue1()
    {
        ((int)ProjectStatus.DevamEden).Should().Be(1);
    }

    [Fact]
    public void ProjectStatus_Tamamlandi_HasValue2()
    {
        ((int)ProjectStatus.Tamamlandi).Should().Be(2);
    }

    [Fact]
    public void ProjectStatus_HasExactlyThreeValues()
    {
        Enum.GetValues<ProjectStatus>().Should().HaveCount(3);
    }

    // Priority
    [Fact]
    public void Priority_None_HasValue0()
    {
        ((int)Priority.None).Should().Be(0);
    }

    [Fact]
    public void Priority_Low_HasValue1()
    {
        ((int)Priority.Low).Should().Be(1);
    }

    [Fact]
    public void Priority_Medium_HasValue2()
    {
        ((int)Priority.Medium).Should().Be(2);
    }

    [Fact]
    public void Priority_High_HasValue3()
    {
        ((int)Priority.High).Should().Be(3);
    }

    [Fact]
    public void Priority_Critical_HasValue4()
    {
        ((int)Priority.Critical).Should().Be(4);
    }

    [Fact]
    public void Priority_HasExactlyFiveValues()
    {
        Enum.GetValues<Priority>().Should().HaveCount(5);
    }

    // SprintState
    [Fact]
    public void SprintState_Draft_HasValue0()
    {
        ((int)SprintState.Draft).Should().Be(0);
    }

    [Fact]
    public void SprintState_InProgress_HasValue1()
    {
        ((int)SprintState.InProgress).Should().Be(1);
    }

    [Fact]
    public void SprintState_Done_HasValue2()
    {
        ((int)SprintState.Done).Should().Be(2);
    }

    // PrivacyLevel
    [Fact]
    public void PrivacyLevel_InviteOnly_HasValue0()
    {
        ((int)PrivacyLevel.InviteOnly).Should().Be(0);
    }

    [Fact]
    public void PrivacyLevel_AllEmployees_HasValue1()
    {
        ((int)PrivacyLevel.AllEmployees).Should().Be(1);
    }

    [Fact]
    public void PrivacyLevel_ClientVisible_HasValue2()
    {
        ((int)PrivacyLevel.ClientVisible).Should().Be(2);
    }

    // EvaluationType
    [Fact]
    public void EvaluationType_None_HasValue0()
    {
        ((int)EvaluationType.None).Should().Be(0);
    }

    [Fact]
    public void EvaluationType_Periodic_HasValue1()
    {
        ((int)EvaluationType.Periodic).Should().Be(1);
    }

    [Fact]
    public void EvaluationType_OnStageChange_HasValue2()
    {
        ((int)EvaluationType.OnStageChange).Should().Be(2);
    }

    // DependencyType
    [Fact]
    public void DependencyType_FinishToStart_HasValue0()
    {
        ((int)DependencyType.FinishToStart).Should().Be(0);
    }

    [Fact]
    public void DependencyType_StartToStart_HasValue1()
    {
        ((int)DependencyType.StartToStart).Should().Be(1);
    }

    [Fact]
    public void DependencyType_FinishToFinish_HasValue2()
    {
        ((int)DependencyType.FinishToFinish).Should().Be(2);
    }

    [Fact]
    public void DependencyType_StartToFinish_HasValue3()
    {
        ((int)DependencyType.StartToFinish).Should().Be(3);
    }

    [Fact]
    public void DependencyType_HasExactlyFourValues()
    {
        Enum.GetValues<DependencyType>().Should().HaveCount(4);
    }

    // CommentType
    [Fact]
    public void CommentType_Note_HasValue0()
    {
        ((int)CommentType.Note).Should().Be(0);
    }

    [Fact]
    public void CommentType_Email_HasValue1()
    {
        ((int)CommentType.Email).Should().Be(1);
    }

    [Fact]
    public void CommentType_SystemLog_HasValue2()
    {
        ((int)CommentType.SystemLog).Should().Be(2);
    }

    [Fact]
    public void CommentType_Meeting_HasValue3()
    {
        ((int)CommentType.Meeting).Should().Be(3);
    }

    [Fact]
    public void CommentType_HasExactlyFourValues()
    {
        Enum.GetValues<CommentType>().Should().HaveCount(4);
    }
}
