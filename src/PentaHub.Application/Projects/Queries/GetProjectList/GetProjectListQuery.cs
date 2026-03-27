using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Projects.Queries.GetProjectList;

public record GetProjectListQuery : IRequest<ApiResponse<List<ProjectListDto>>>
{
    public ProjectStatus? Status { get; init; }
    public int? ManagerId { get; init; }
    public string? Search { get; init; }
    public bool? ExcludeTemplates { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}
