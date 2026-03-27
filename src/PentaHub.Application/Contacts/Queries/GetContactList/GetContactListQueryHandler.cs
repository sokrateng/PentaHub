using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Contacts.Queries.GetContactList;

public class GetContactListQueryHandler : IRequestHandler<GetContactListQuery, ApiResponse<List<ContactListDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetContactListQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ContactListDto>>> Handle(GetContactListQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Contacts.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(c =>
                c.CompanyName.ToLower().Contains(search) ||
                (c.ContactPersonName != null && c.ContactPersonName.ToLower().Contains(search)) ||
                (c.Email != null && c.Email.ToLower().Contains(search)));
        }

        if (!string.IsNullOrWhiteSpace(request.City))
            query = query.Where(c => c.City != null && c.City.ToLower().Contains(request.City.ToLower()));

        if (!string.IsNullOrWhiteSpace(request.Country))
            query = query.Where(c => c.Country != null && c.Country.ToLower().Contains(request.Country.ToLower()));

        var total = await query.CountAsync(cancellationToken);

        var contacts = await query
            .OrderBy(c => c.CompanyName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<ContactListDto>>(contacts);

        return ApiResponse<List<ContactListDto>>.Ok(dtos, new PaginationMeta
        {
            Total = total,
            Page = request.Page,
            PageSize = request.PageSize
        });
    }
}
