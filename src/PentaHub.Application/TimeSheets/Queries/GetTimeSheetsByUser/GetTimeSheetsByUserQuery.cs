using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByUser;

public record GetTimeSheetsByUserQuery : IRequest<ApiResponse<List<TimeSheetDto>>>
{
    public int UserId { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
}
