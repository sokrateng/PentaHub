using MediatR;

namespace PentaHub.Application.Resources.Commands.DeleteResourceAllocation;

public record DeleteResourceAllocationCommand(int Id) : IRequest;
