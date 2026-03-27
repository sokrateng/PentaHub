using MediatR;

namespace PentaHub.Application.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(int Id) : IRequest;
