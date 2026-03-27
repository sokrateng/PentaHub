using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.TimeSheets.Commands.CreateTimeSheet;

public record CreateTimeSheetCommand : IRequest<TimeSheetDto>
{
    public int UserId { get; init; }
    public int TaskId { get; init; }
    public DateTime Date { get; init; }
    public decimal Hours { get; init; }
    public string? Description { get; init; }
    public bool IsBillable { get; init; }
}
