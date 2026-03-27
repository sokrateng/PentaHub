using MediatR;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Comments.Commands.AddComment;

public class AddCommentCommandHandler : IRequestHandler<AddCommentCommand, CommentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IHubNotificationService _hubNotificationService;

    public AddCommentCommandHandler(IApplicationDbContext context, IHubNotificationService hubNotificationService)
    {
        _context = context;
        _hubNotificationService = hubNotificationService;
    }

    public async Task<CommentDto> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        // TODO: Replace with actual AuthorId from authenticated user when auth is implemented
        const int authorId = 1;

        var comment = new Comment
        {
            EntityType = request.EntityType,
            EntityId = request.EntityId,
            AuthorId = authorId,
            Content = request.Content,
            CommentType = request.Type,
            IsInternal = request.IsInternal
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        var author = await _context.Users.FindAsync(new object[] { authorId }, cancellationToken);

        var dto = new CommentDto
        {
            Id = comment.Id,
            EntityType = comment.EntityType,
            EntityId = comment.EntityId,
            AuthorId = comment.AuthorId,
            AuthorName = author?.FullName ?? string.Empty,
            AuthorAvatarUrl = author?.AvatarUrl,
            Content = comment.Content,
            CommentType = comment.CommentType,
            IsInternal = comment.IsInternal,
            CreatedAt = comment.CreatedAt
        };

        // Broadcast to SignalR group
        await _hubNotificationService.SendCommentAddedAsync(request.EntityType, request.EntityId, dto, cancellationToken);

        return dto;
    }
}
