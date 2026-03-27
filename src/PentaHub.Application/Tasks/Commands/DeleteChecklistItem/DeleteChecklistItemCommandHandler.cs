using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Tasks.Commands.DeleteChecklistItem;

public class DeleteChecklistItemCommandHandler : IRequestHandler<DeleteChecklistItemCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteChecklistItemCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteChecklistItemCommand request, CancellationToken cancellationToken)
    {
        var item = await _context.TaskChecklists
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Kontrol listesi öğesi bulunamadı: {request.Id}");

        item.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
