using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PasswordHash { get; set; }
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = "User";
    public string? Department { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<Project> ManagedProjects { get; set; } = new List<Project>();
    public ICollection<ResourceAllocation> ResourceAllocations { get; set; } = new List<ResourceAllocation>();
    public ICollection<TimeSheet> TimeSheets { get; set; } = new List<TimeSheet>();
}
