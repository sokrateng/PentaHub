using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Resources.Queries.GetResourcesByProject;

public class GetResourcesByProjectQueryHandler : IRequestHandler<GetResourcesByProjectQuery, ApiResponse<List<ResourceAllocationDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetResourcesByProjectQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<ResourceAllocationDto>>> Handle(GetResourcesByProjectQuery request, CancellationToken cancellationToken)
    {
        var allocations = await _context.ResourceAllocations
            .Include(r => r.User)
            .Include(r => r.Project)
            .Include(r => r.Task)
            .Where(r => r.ProjectId == request.ProjectId)
            .OrderBy(r => r.StartDate)
            .ToListAsync(cancellationToken);

        var dtos = allocations.Select(r => new ResourceAllocationDto
        {
            Id = r.Id,
            UserId = r.UserId,
            UserFullName = r.User.FullName,
            UserAvatarUrl = r.User.AvatarUrl,
            ProjectId = r.ProjectId,
            ProjectName = r.Project.Name,
            TaskId = r.TaskId,
            TaskTitle = r.Task?.Title,
            StartDate = r.StartDate,
            EndDate = r.EndDate,
            HoursPerDay = r.HoursPerDay,
            TotalHours = r.TotalHours,
            Notes = r.Notes,
            CreatedAt = r.CreatedAt
        }).ToList();

        return ApiResponse<List<ResourceAllocationDto>>.Ok(dtos);
    }
}
