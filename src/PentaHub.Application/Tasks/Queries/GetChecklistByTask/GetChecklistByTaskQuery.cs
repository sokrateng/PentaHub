using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetChecklistByTask;

public record GetChecklistByTaskQuery(int TaskId) : IRequest<List<TaskChecklistDto>>;
