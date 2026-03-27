using FluentAssertions;
using PentaHub.Domain.Common;

namespace PentaHub.Domain.Tests.Entities;

// Concrete subclass used only for instantiation in tests
public class TestEntity : BaseEntity { }

public class BaseEntityTests
{
    [Fact]
    public void Id_DefaultsToZero()
    {
        var entity = new TestEntity();

        entity.Id.Should().Be(0);
    }

    [Fact]
    public void CreatedAt_DefaultsToUtcNow()
    {
        var before = DateTime.UtcNow.AddSeconds(-1);
        var entity = new TestEntity();
        var after = DateTime.UtcNow.AddSeconds(1);

        entity.CreatedAt.Should().BeAfter(before).And.BeBefore(after);
        entity.CreatedAt.Kind.Should().Be(DateTimeKind.Utc);
    }

    [Fact]
    public void IsDeleted_DefaultsToFalse()
    {
        var entity = new TestEntity();

        entity.IsDeleted.Should().BeFalse();
    }

    [Fact]
    public void UpdatedAt_DefaultsToNull()
    {
        var entity = new TestEntity();

        entity.UpdatedAt.Should().BeNull();
    }

    [Fact]
    public void CreatedBy_DefaultsToNull()
    {
        var entity = new TestEntity();

        entity.CreatedBy.Should().BeNull();
    }

    [Fact]
    public void UpdatedBy_DefaultsToNull()
    {
        var entity = new TestEntity();

        entity.UpdatedBy.Should().BeNull();
    }

    [Fact]
    public void Properties_CanBeSetAndRead()
    {
        var entity = new TestEntity
        {
            Id = 42,
            CreatedBy = "admin",
            UpdatedBy = "editor",
            UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            IsDeleted = true
        };

        entity.Id.Should().Be(42);
        entity.CreatedBy.Should().Be("admin");
        entity.UpdatedBy.Should().Be("editor");
        entity.UpdatedAt.Should().Be(new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        entity.IsDeleted.Should().BeTrue();
    }
}
