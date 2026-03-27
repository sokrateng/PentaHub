using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Comments.Commands.DeleteComment;

public class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCommentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (comment is null)
            throw new KeyNotFoundException($"Yorum bulunamadı: {request.Id}");

        comment.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
