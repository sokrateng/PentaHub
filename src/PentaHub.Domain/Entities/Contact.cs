using PentaHub.Domain.Common;

namespace PentaHub.Domain.Entities;

public class Contact : BaseEntity
{
    public string CompanyName { get; set; } = string.Empty;
    public string? ContactPersonName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Mobile { get; set; }
    public string? Website { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Tags { get; set; }

    // Navigation
    public ICollection<Project> Projects { get; set; } = new List<Project>();
}
