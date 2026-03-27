using FluentAssertions;
using PentaHub.Domain.Entities;

namespace PentaHub.Domain.Tests.Entities;

public class ContactTests
{
    [Fact]
    public void CompanyName_DefaultsToEmptyString()
    {
        var contact = new Contact();

        contact.CompanyName.Should().Be(string.Empty);
    }

    [Fact]
    public void NullableStringProperties_DefaultToNull()
    {
        var contact = new Contact();

        contact.ContactPersonName.Should().BeNull();
        contact.Email.Should().BeNull();
        contact.Phone.Should().BeNull();
        contact.Mobile.Should().BeNull();
        contact.Website.Should().BeNull();
        contact.Address.Should().BeNull();
        contact.City.Should().BeNull();
        contact.Country.Should().BeNull();
        contact.Tags.Should().BeNull();
    }

    [Fact]
    public void NavigationCollection_Projects_IsInitialized()
    {
        var contact = new Contact();

        contact.Projects.Should().NotBeNull().And.BeEmpty();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var contact = new Contact
        {
            CompanyName = "Acme Corp",
            ContactPersonName = "John Doe",
            Email = "john@acme.com",
            Phone = "+90 212 000 0000",
            City = "Istanbul",
            Country = "Turkey"
        };

        contact.CompanyName.Should().Be("Acme Corp");
        contact.ContactPersonName.Should().Be("John Doe");
        contact.Email.Should().Be("john@acme.com");
        contact.Phone.Should().Be("+90 212 000 0000");
        contact.City.Should().Be("Istanbul");
        contact.Country.Should().Be("Turkey");
    }

    [Fact]
    public void InheritsBaseEntity_IsDeletedDefaultsFalse()
    {
        var contact = new Contact();

        contact.IsDeleted.Should().BeFalse();
    }
}
