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
        var projects = await _context.Projects.ToListAsync(cancellationToken);

        return new ProjectStatsDto
        {
            Total = projects.Count,
            Active = projects.Count(p => p.Status == ProjectStatus.DevamEden),
            Waiting = projects.Count(p => p.Status == ProjectStatus.Beklemede),
            Completed = projects.Count(p => p.Status == ProjectStatus.Tamamlandi),
            Overdue = projects.Count(p => p.EndDate.HasValue && p.EndDate.Value < DateTime.UtcNow && p.Status != ProjectStatus.Tamamlandi)
        };
    }
}
