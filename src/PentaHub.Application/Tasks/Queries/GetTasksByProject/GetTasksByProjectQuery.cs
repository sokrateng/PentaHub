using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetTasksByProject;

public record GetTasksByProjectQuery : IRequest<ApiResponse<List<TaskKanbanDto>>>
{
    public int ProjectId { get; init; }
    public bool GroupByStage { get; init; } = true;
}
