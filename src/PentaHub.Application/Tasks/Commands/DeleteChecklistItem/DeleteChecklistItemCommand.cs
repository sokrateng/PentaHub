using MediatR;

namespace PentaHub.Application.Tasks.Commands.DeleteChecklistItem;

public record DeleteChecklistItemCommand(int Id) : IRequest;
