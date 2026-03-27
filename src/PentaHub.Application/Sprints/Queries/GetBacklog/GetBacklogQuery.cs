using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Queries.GetBacklog;

public record GetBacklogQuery(int ProjectId) : IRequest<ApiResponse<List<ProjectTaskDto>>>;
