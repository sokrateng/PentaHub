using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Tasks.Commands.RemoveDependency;

public class RemoveDependencyCommandHandler : IRequestHandler<RemoveDependencyCommand>
{
    private readonly IApplicationDbContext _context;

    public RemoveDependencyCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(RemoveDependencyCommand request, CancellationToken cancellationToken)
    {
        var dependency = await _context.TaskDependencies
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Bağımlılık bulunamadı: {request.Id}");

        dependency.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
