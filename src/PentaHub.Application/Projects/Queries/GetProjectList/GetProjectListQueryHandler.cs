using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Projects.Queries.GetProjectList;

public class GetProjectListQueryHandler : IRequestHandler<GetProjectListQuery, ApiResponse<List<ProjectListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetProjectListQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ProjectListDto>>> Handle(GetProjectListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Projects.Include(p => p.ProjectManager).AsQueryable();

        if (request.Status.HasValue)
            query = query.Where(p => p.Status == request.Status.Value);

        if (request.ManagerId.HasValue)
            query = query.Where(p => p.ProjectManagerId == request.ManagerId.Value);

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(p => p.Name.Contains(request.Search) || (p.Description != null && p.Description.Contains(request.Search)));

        if (request.ExcludeTemplates == true)
            query = query.Where(p => !p.IsTemplate);

        var total = await query.CountAsync(cancellationToken);

        var projects = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<ProjectListDto>>(projects);

        return ApiResponse<List<ProjectListDto>>.Ok(dtos, new PaginationMeta
        {
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize
        });
    }
}
