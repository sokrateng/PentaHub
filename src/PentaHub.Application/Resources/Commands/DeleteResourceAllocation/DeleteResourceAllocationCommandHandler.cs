using MediatR;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Resources.Commands.DeleteResourceAllocation;

public class DeleteResourceAllocationCommandHandler : IRequestHandler<DeleteResourceAllocationCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteResourceAllocationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteResourceAllocationCommand request, CancellationToken cancellationToken)
    {
        var allocation = await _context.ResourceAllocations.FindAsync(new object[] { request.Id }, cancellationToken)
            ?? throw new KeyNotFoundException($"Kaynak tahsisi bulunamadı: {request.Id}");

        allocation.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
