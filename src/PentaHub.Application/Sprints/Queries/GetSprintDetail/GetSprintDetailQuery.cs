using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Sprints.Queries.GetSprintDetail;

public record GetSprintDetailQuery(int Id) : IRequest<SprintDetailDto?>;
