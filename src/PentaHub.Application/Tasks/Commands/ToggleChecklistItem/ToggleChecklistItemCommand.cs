using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Commands.ToggleChecklistItem;

public record ToggleChecklistItemCommand(int Id) : IRequest<TaskChecklistDto>;
