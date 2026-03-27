using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Milestones.Queries.GetMilestonesByProject;

public record GetMilestonesByProjectQuery(int ProjectId) : IRequest<ApiResponse<List<MilestoneDto>>>;
