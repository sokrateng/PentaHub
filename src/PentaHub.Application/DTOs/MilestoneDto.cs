namespace PentaHub.Application.DTOs;

public class MilestoneDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime? TargetDate { get; set; }
    public int SortOrder { get; set; }
    public int TaskCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
