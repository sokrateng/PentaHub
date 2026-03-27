namespace PentaHub.Application.DTOs;

public class TimeSheetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserFullName { get; set; }
    public int TaskId { get; set; }
    public string? TaskTitle { get; set; }
    public string? TaskNumber { get; set; }
    public DateTime Date { get; set; }
    public decimal Hours { get; set; }
    public string? Description { get; set; }
    public bool IsBillable { get; set; }
    public DateTime CreatedAt { get; set; }
}
