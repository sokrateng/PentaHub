using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Milestones.Commands.CreateMilestone;
using PentaHub.Application.Milestones.Commands.UpdateMilestone;
using PentaHub.Application.Milestones.Commands.DeleteMilestone;
using PentaHub.Application.Milestones.Queries.GetMilestonesByProject;

namespace PentaHub.API.Endpoints;

public static class MilestoneEndpoints
{
    public static void MapMilestoneEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Milestones");

        group.MapPost("/milestones", async (CreateMilestoneCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/milestones/{result.Id}", ApiResponse<MilestoneDto>.Ok(result));
        })
        .WithName("CreateMilestone")
        .Produces<ApiResponse<MilestoneDto>>(201);

        group.MapGet("/projects/{projectId:int}/milestones", async (int projectId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetMilestonesByProjectQuery(projectId));
            return Results.Ok(result);
        })
        .WithName("GetMilestonesByProject")
        .Produces<ApiResponse<List<MilestoneDto>>>();

        group.MapPut("/milestones/{id:int}", async (int id, UpdateMilestoneCommand command, IMediator mediator) =>
        {
            var updated = command with { Id = id };
            var result = await mediator.Send(updated);
            return Results.Ok(ApiResponse<MilestoneDto>.Ok(result));
        })
        .WithName("UpdateMilestone")
        .Produces<ApiResponse<MilestoneDto>>();

        group.MapDelete("/milestones/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteMilestoneCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteMilestone")
        .Produces<ApiResponse<bool>>();
    }
}
