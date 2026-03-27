using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Resources.Commands.CreateResourceAllocation;
using PentaHub.Application.Resources.Commands.DeleteResourceAllocation;
using PentaHub.Application.Resources.Queries.GetResourcesByProject;

namespace PentaHub.API.Endpoints;

public static class ResourceEndpoints
{
    public static void MapResourceEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Resources");

        group.MapPost("/resources", async (CreateResourceAllocationCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/resources/{result.Id}", ApiResponse<ResourceAllocationDto>.Ok(result));
        })
        .WithName("CreateResourceAllocation")
        .Produces<ApiResponse<ResourceAllocationDto>>(201);

        group.MapGet("/projects/{projectId:int}/resources", async (int projectId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetResourcesByProjectQuery(projectId));
            return Results.Ok(result);
        })
        .WithName("GetResourcesByProject")
        .Produces<ApiResponse<List<ResourceAllocationDto>>>();

        group.MapDelete("/resources/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteResourceAllocationCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteResourceAllocation")
        .Produces<ApiResponse<bool>>();
    }
}
