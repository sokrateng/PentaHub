using MediatR;

namespace PentaHub.Application.Tasks.Commands.MoveTaskStage;

public record MoveTaskStageCommand(int TaskId, int StageId) : IRequest<bool>;
