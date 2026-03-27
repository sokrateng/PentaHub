using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Resources.Commands.CreateResourceAllocation;

public record CreateResourceAllocationCommand : IRequest<ResourceAllocationDto>
{
    public int UserId { get; init; }
    public int ProjectId { get; init; }
    public int? TaskId { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public decimal HoursPerDay { get; init; }
    public string? Notes { get; init; }
}
