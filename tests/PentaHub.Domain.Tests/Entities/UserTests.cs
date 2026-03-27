using FluentAssertions;
using PentaHub.Domain.Entities;

namespace PentaHub.Domain.Tests.Entities;

public class UserTests
{
    [Fact]
    public void Role_DefaultsToUser()
    {
        var user = new User();

        user.Role.Should().Be("User");
    }

    [Fact]
    public void IsActive_DefaultsToTrue()
    {
        var user = new User();

        user.IsActive.Should().BeTrue();
    }

    [Fact]
    public void FullName_DefaultsToEmptyString()
    {
        var user = new User();

        user.FullName.Should().Be(string.Empty);
    }

    [Fact]
    public void Email_DefaultsToEmptyString()
    {
        var user = new User();

        user.Email.Should().Be(string.Empty);
    }

    [Fact]
    public void NullableProperties_DefaultToNull()
    {
        var user = new User();

        user.PasswordHash.Should().BeNull();
        user.AvatarUrl.Should().BeNull();
        user.Department.Should().BeNull();
        user.RefreshToken.Should().BeNull();
        user.RefreshTokenExpiryTime.Should().BeNull();
    }

    [Fact]
    public void NavigationCollections_AreInitialized()
    {
        var user = new User();

        user.ManagedProjects.Should().NotBeNull().And.BeEmpty();
        user.ResourceAllocations.Should().NotBeNull().And.BeEmpty();
        user.TimeSheets.Should().NotBeNull().And.BeEmpty();
        user.Comments.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var user = new User
        {
            FullName = "Ali Veli",
            Email = "ali@example.com",
            Role = "Admin",
            Department = "Engineering",
            IsActive = false
        };

        user.FullName.Should().Be("Ali Veli");
        user.Email.Should().Be("ali@example.com");
        user.Role.Should().Be("Admin");
        user.Department.Should().Be("Engineering");
        user.IsActive.Should().BeFalse();
    }
}
