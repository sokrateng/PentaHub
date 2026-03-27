using PentaHub.Domain.Common;
using PentaHub.Domain.Enums;

namespace PentaHub.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Beklemede;
    public int ProjectManagerId { get; set; }
    public int? ContactId { get; set; }
    public string? DepartmentName { get; set; }
    public PrivacyLevel PrivacyLevel { get; set; } = PrivacyLevel.AllEmployees;
    public bool IsBillable { get; set; } = false;
    public bool IsTemplate { get; set; } = false;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? ProjectEmail { get; set; }
    public EvaluationType CustomerEvaluation { get; set; } = EvaluationType.None;
    public string? EvaluationFrequency { get; set; }
    public int? SalesOrderId { get; set; }

    // Navigation
    public User ProjectManager { get; set; } = null!;
    public ICollection<TaskStage> TaskStages { get; set; } = new List<TaskStage>();
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
