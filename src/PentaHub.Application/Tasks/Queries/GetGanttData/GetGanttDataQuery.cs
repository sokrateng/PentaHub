using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetGanttData;

public record GetGanttDataQuery(int ProjectId) : IRequest<List<GanttTaskDto>>;
