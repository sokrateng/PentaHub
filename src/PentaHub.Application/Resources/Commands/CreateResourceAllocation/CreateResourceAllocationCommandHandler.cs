using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Resources.Commands.CreateResourceAllocation;

public class CreateResourceAllocationCommandHandler : IRequestHandler<CreateResourceAllocationCommand, ResourceAllocationDto>
{
    private readonly IApplicationDbContext _context;

    public CreateResourceAllocationCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResourceAllocationDto> Handle(CreateResourceAllocationCommand request, CancellationToken cancellationToken)
    {
        // Validate user exists
        var user = await _context.Users.FindAsync(new object[] { request.UserId }, cancellationToken)
            ?? throw new KeyNotFoundException($"Kullanıcı bulunamadı: {request.UserId}");

        // Validate project exists
        var project = await _context.Projects.FindAsync(new object[] { request.ProjectId }, cancellationToken)
            ?? throw new KeyNotFoundException($"Proje bulunamadı: {request.ProjectId}");

        // Calculate TotalHours based on working days
        var workingDays = CountWorkingDays(request.StartDate, request.EndDate);
        var totalHours = workingDays * request.HoursPerDay;

        var allocation = new ResourceAllocation
        {
            UserId = request.UserId,
            ProjectId = request.ProjectId,
            TaskId = request.TaskId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            HoursPerDay = request.HoursPerDay,
            TotalHours = totalHours,
            Notes = request.Notes
        };

        _context.ResourceAllocations.Add(allocation);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.ResourceAllocations
            .Include(r => r.User)
            .Include(r => r.Project)
            .Include(r => r.Task)
            .FirstAsync(r => r.Id == allocation.Id, cancellationToken);

        return MapToDto(created);
    }

    private static int CountWorkingDays(DateTime start, DateTime end)
    {
        int count = 0;
        var current = start.Date;
        while (current <= end.Date)
        {
            if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
                count++;
            current = current.AddDays(1);
        }
        return count;
    }

    private static ResourceAllocationDto MapToDto(ResourceAllocation r) => new()
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
    };
}
