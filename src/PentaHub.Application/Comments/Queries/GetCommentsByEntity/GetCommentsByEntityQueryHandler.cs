using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Comments.Queries.GetCommentsByEntity;

public class GetCommentsByEntityQueryHandler : IRequestHandler<GetCommentsByEntityQuery, List<CommentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCommentsByEntityQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CommentDto>> Handle(GetCommentsByEntityQuery request, CancellationToken cancellationToken)
    {
        var comments = await _context.Comments
            .Include(c => c.Author)
            .Where(c => c.EntityType == request.EntityType && c.EntityId == request.EntityId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        return comments.Select(c => new CommentDto
        {
            Id = c.Id,
            EntityType = c.EntityType,
            EntityId = c.EntityId,
            AuthorId = c.AuthorId,
            AuthorName = c.Author.FullName,
            AuthorAvatarUrl = c.Author.AvatarUrl,
            Content = c.Content,
            CommentType = c.CommentType,
            IsInternal = c.IsInternal,
            CreatedAt = c.CreatedAt
        }).ToList();
    }
}
