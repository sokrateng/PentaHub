namespace PentaHub.Application.DTOs;

public class ContactDto
{
    public int Id { get; set; }
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
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class ContactListDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? ContactPersonName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Tags { get; set; }
}
