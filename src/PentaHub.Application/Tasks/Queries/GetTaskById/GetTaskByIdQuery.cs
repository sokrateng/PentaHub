using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetTaskById;

public record GetTaskByIdQuery(int Id) : IRequest<ProjectTaskDto?>;
