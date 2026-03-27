using MediatR;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Comments.Commands.AddComment;

public record AddCommentCommand : IRequest<CommentDto>
{
    public string EntityType { get; init; } = string.Empty;
    public int EntityId { get; init; }
    public string Content { get; init; } = string.Empty;
    public CommentType Type { get; init; } = CommentType.Note;
    public bool IsInternal { get; init; } = true;
}
