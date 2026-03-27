using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByUser;

public class GetTimeSheetsByUserQueryHandler : IRequestHandler<GetTimeSheetsByUserQuery, ApiResponse<List<TimeSheetDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetTimeSheetsByUserQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<TimeSheetDto>>> Handle(GetTimeSheetsByUserQuery request, CancellationToken cancellationToken)
    {
        var query = _context.TimeSheets
            .Include(ts => ts.User)
            .Include(ts => ts.Task)
            .Where(ts => ts.UserId == request.UserId);

        if (request.StartDate.HasValue)
            query = query.Where(ts => ts.Date >= request.StartDate.Value);

        if (request.EndDate.HasValue)
            query = query.Where(ts => ts.Date <= request.EndDate.Value);

        var timeSheets = await query
            .OrderByDescending(ts => ts.Date)
            .ToListAsync(cancellationToken);

        var dtos = timeSheets.Select(ts => new TimeSheetDto
        {
            Id = ts.Id,
            UserId = ts.UserId,
            UserFullName = ts.User.FullName,
            TaskId = ts.TaskId,
            TaskTitle = ts.Task.Title,
            TaskNumber = ts.Task.TaskNumber,
            Date = ts.Date,
            Hours = ts.Hours,
            Description = ts.Description,
            IsBillable = ts.IsBillable,
            CreatedAt = ts.CreatedAt
        }).ToList();

        return ApiResponse<List<TimeSheetDto>>.Ok(dtos);
    }
}
