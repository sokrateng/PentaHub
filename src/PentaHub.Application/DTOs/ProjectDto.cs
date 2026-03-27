using PentaHub.Domain.Enums;

namespace PentaHub.Application.DTOs;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectStatus Status { get; set; }
    public string StatusText => Status switch
    {
        ProjectStatus.Beklemede => "Beklemede",
        ProjectStatus.DevamEden => "Devam Eden",
        ProjectStatus.Tamamlandi => "Tamamlandı",
        _ => Status.ToString()
    };
    public int ProjectManagerId { get; set; }
    public string? ProjectManagerName { get; set; }
    public int? ContactId { get; set; }
    public string? DepartmentName { get; set; }
    public PrivacyLevel PrivacyLevel { get; set; }
    public bool IsBillable { get; set; }
    public bool IsTemplate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ProjectEmail { get; set; }
    public EvaluationType CustomerEvaluation { get; set; }
    public string? EvaluationFrequency { get; set; }
    public int? SalesOrderId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProjectListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; }
    public string StatusText => Status switch
    {
        ProjectStatus.Beklemede => "Beklemede",
        ProjectStatus.DevamEden => "Devam Eden",
        ProjectStatus.Tamamlandi => "Tamamlandı",
        _ => Status.ToString()
    };
    public int ProjectManagerId { get; set; }
    public string? ProjectManagerName { get; set; }
    public string? DepartmentName { get; set; }
    public bool IsBillable { get; set; }
    public bool IsTemplate { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int TaskCount { get; set; } // Placeholder for now
}

public class ProjectStatsDto
{
    public int Total { get; set; }
    public int Active { get; set; }
    public int Waiting { get; set; }
    public int Completed { get; set; }
    public int Overdue { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? Department { get; set; }
}
