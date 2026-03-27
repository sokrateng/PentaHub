using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Sprints.Queries.GetSprintList;

public record GetSprintListQuery : IRequest<ApiResponse<List<SprintDto>>>
{
    public int? ProjectId { get; init; }
    public SprintState? State { get; init; }
}
