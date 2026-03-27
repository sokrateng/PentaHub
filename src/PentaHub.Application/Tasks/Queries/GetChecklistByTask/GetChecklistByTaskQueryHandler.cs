using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Tasks.Queries.GetChecklistByTask;

public class GetChecklistByTaskQueryHandler : IRequestHandler<GetChecklistByTaskQuery, List<TaskChecklistDto>>
{
    private readonly IApplicationDbContext _context;

    public GetChecklistByTaskQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskChecklistDto>> Handle(GetChecklistByTaskQuery request, CancellationToken cancellationToken)
    {
        return await _context.TaskChecklists
            .Include(c => c.Assignee)
            .Where(c => c.TaskId == request.TaskId)
            .OrderBy(c => c.SortOrder)
            .Select(c => new TaskChecklistDto
            {
                Id = c.Id,
                TaskId = c.TaskId,
                Title = c.Title,
                AssigneeId = c.AssigneeId,
                AssigneeName = c.Assignee != null ? c.Assignee.FullName : null,
                IsCompleted = c.IsCompleted,
                SortOrder = c.SortOrder
            })
            .ToListAsync(cancellationToken);
    }
}
