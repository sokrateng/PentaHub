using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Resources.Queries.GetResourcesByProject;

public record GetResourcesByProjectQuery(int ProjectId) : IRequest<ApiResponse<List<ResourceAllocationDto>>>;
