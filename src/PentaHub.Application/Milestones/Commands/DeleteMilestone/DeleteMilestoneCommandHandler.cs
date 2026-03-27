using MediatR;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Milestones.Commands.DeleteMilestone;

public class DeleteMilestoneCommandHandler : IRequestHandler<DeleteMilestoneCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteMilestoneCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteMilestoneCommand request, CancellationToken cancellationToken)
    {
        var milestone = await _context.Milestones.FindAsync(new object[] { request.Id }, cancellationToken)
            ?? throw new KeyNotFoundException($"Kilometre taşı bulunamadı: {request.Id}");

        milestone.IsDeleted = true;
        await _context.SaveChangesAsync(cancellationToken);
    }
}
