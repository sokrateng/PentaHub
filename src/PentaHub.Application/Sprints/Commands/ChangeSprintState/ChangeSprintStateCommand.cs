using MediatR;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Sprints.Commands.ChangeSprintState;

public record ChangeSprintStateCommand(int SprintId, SprintState NewState) : IRequest<SprintDto>;
