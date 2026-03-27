using MediatR;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Projects.Commands.UpdateProject;

public record UpdateProjectCommand : IRequest<ProjectDto>
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public ProjectStatus Status { get; init; }
    public int ProjectManagerId { get; init; }
    public int? ContactId { get; init; }
    public string? DepartmentName { get; init; }
    public PrivacyLevel PrivacyLevel { get; init; }
    public bool IsBillable { get; init; }
    public bool IsTemplate { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public string? ProjectEmail { get; init; }
    public EvaluationType CustomerEvaluation { get; init; }
    public string? EvaluationFrequency { get; init; }
}
