namespace PentaHub.Application.DTOs;

public class ResourceAllocationDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserFullName { get; set; }
    public string? UserAvatarUrl { get; set; }
    public int ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public int? TaskId { get; set; }
    public string? TaskTitle { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal HoursPerDay { get; set; }
    public decimal TotalHours { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
