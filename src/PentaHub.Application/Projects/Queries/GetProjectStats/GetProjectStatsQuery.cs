using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Projects.Queries.GetProjectStats;

public record GetProjectStatsQuery : IRequest<ProjectStatsDto>;
