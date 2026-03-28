using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Enums;

namespace PentaHub.Application.Projects.Queries.GetProjectStats;

public class GetProjectStatsQueryHandler : IRequestHandler<GetProjectStatsQuery, ProjectStatsDto>
{
    private readonly IApplicationDbContext _context;

    public GetProjectStatsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ProjectStatsDto> Handle(GetProjectStatsQuery request, CancellationToken cancellationToken)
    {
        var total = await _context.Projects.CountAsync(cancellationToken);
        var active = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.DevamEden, cancellationToken);
        var waiting = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Beklemede, cancellationToken);
        var completed = await _context.Projects.CountAsync(p => p.Status == ProjectStatus.Tamamlandi, cancellationToken);
        var overdue = await _context.Projects.CountAsync(p => p.EndDate.HasValue && p.EndDate.Value < DateTime.UtcNow && p.Status != ProjectStatus.Tamamlandi, cancellationToken);

        return new ProjectStatsDto
        {
            Total = total,
            Active = active,
            Waiting = waiting,
            Completed = completed,
            Overdue = overdue
        };
    }
}
