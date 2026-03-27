using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Projects.Queries.GetProjectMetrics;

public record GetProjectMetricsQuery(int ProjectId) : IRequest<ProjectMetricsDto>;
