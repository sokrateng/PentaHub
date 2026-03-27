using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByTask;

public class GetTimeSheetsByTaskQueryHandler : IRequestHandler<GetTimeSheetsByTaskQuery, ApiResponse<List<TimeSheetDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetTimeSheetsByTaskQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<TimeSheetDto>>> Handle(GetTimeSheetsByTaskQuery request, CancellationToken cancellationToken)
    {
        var timeSheets = await _context.TimeSheets
            .Include(ts => ts.User)
            .Include(ts => ts.Task)
            .Where(ts => ts.TaskId == request.TaskId)
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
