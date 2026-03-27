using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Sprints.Commands.AssignTaskToSprint;
using PentaHub.Application.Sprints.Commands.ChangeSprintState;
using PentaHub.Application.Sprints.Commands.CreateSprint;
using PentaHub.Application.Sprints.Commands.RemoveTaskFromSprint;
using PentaHub.Application.Sprints.Commands.UpdateSprint;
using PentaHub.Application.Sprints.Queries.GetBacklog;
using PentaHub.Application.Sprints.Queries.GetSprintDetail;
using PentaHub.Application.Sprints.Queries.GetSprintList;
using PentaHub.Domain.Enums;

namespace PentaHub.API.Endpoints;

public static class SprintEndpoints
{
    public static void MapSprintEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Sprints");

        group.MapPost("/sprints", async (CreateSprintCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/sprints/{result.Id}", ApiResponse<SprintDto>.Ok(result));
        })
        .WithName("CreateSprint")
        .Produces<ApiResponse<SprintDto>>(201);

        group.MapGet("/sprints", async (IMediator mediator, int? projectId = null, SprintState? state = null) =>
        {
            var query = new GetSprintListQuery { ProjectId = projectId, State = state };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetSprintList")
        .Produces<ApiResponse<List<SprintDto>>>();

        group.MapGet("/sprints/{id:int}", async (int id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetSprintDetailQuery(id));
            return result is null
                ? Results.NotFound(ApiResponse<SprintDetailDto>.Fail("Sprint bulunamadı"))
                : Results.Ok(ApiResponse<SprintDetailDto>.Ok(result));
        })
        .WithName("GetSprintDetail")
        .Produces<ApiResponse<SprintDetailDto>>()
        .ProducesProblem(404);

        group.MapPut("/sprints/{id:int}", async (int id, UpdateSprintCommand command, IMediator mediator) =>
        {
            var updated = command with { Id = id };
            var result = await mediator.Send(updated);
            return Results.Ok(ApiResponse<SprintDto>.Ok(result));
        })
        .WithName("UpdateSprint")
        .Produces<ApiResponse<SprintDto>>();

        group.MapPatch("/sprints/{id:int}/state", async (int id, ChangeSprintStateRequest body, IMediator mediator) =>
        {
            var command = new ChangeSprintStateCommand(id, (SprintState)body.NewState);
            var result = await mediator.Send(command);
            return Results.Ok(ApiResponse<SprintDto>.Ok(result));
        })
        .WithName("ChangeSprintState")
        .Produces<ApiResponse<SprintDto>>();

        group.MapPost("/sprints/{id:int}/assign-task", async (int id, AssignTaskRequest body, IMediator mediator) =>
        {
            var command = new AssignTaskToSprintCommand(id, body.TaskId);
            await mediator.Send(command);
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("AssignTaskToSprint")
        .Produces<ApiResponse<bool>>();

        group.MapPost("/sprints/{id:int}/remove-task", async (int id, RemoveTaskRequest body, IMediator mediator) =>
        {
            var command = new RemoveTaskFromSprintCommand(id, body.TaskId);
            await mediator.Send(command);
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("RemoveTaskFromSprint")
        .Produces<ApiResponse<bool>>();

        group.MapGet("/projects/{projectId:int}/backlog", async (int projectId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetBacklogQuery(projectId));
            return Results.Ok(result);
        })
        .WithName("GetBacklog")
        .Produces<ApiResponse<List<ProjectTaskDto>>>();
    }
}

public record ChangeSprintStateRequest(int NewState);
public record AssignTaskRequest(int TaskId);
public record RemoveTaskRequest(int TaskId);
