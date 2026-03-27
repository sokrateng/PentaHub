using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Tasks.Commands.CreateTask;
using PentaHub.Application.Tasks.Commands.UpdateTask;
using PentaHub.Application.Tasks.Commands.MoveTaskStage;
using PentaHub.Application.Tasks.Commands.DeleteTask;
using PentaHub.Application.Tasks.Queries.GetTasksByProject;
using PentaHub.Application.Tasks.Queries.GetTaskById;

namespace PentaHub.API.Endpoints;

public static class TaskEndpoints
{
    public static void MapTaskEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Tasks");

        group.MapPost("/projects/{projectId:int}/tasks", async (int projectId, CreateTaskCommand command, IMediator mediator) =>
        {
            var taskCommand = command with { ProjectId = projectId };
            var result = await mediator.Send(taskCommand);
            return Results.Created($"/api/tasks/{result.Id}", ApiResponse<ProjectTaskDto>.Ok(result));
        })
        .WithName("CreateTask")
        .Produces<ApiResponse<ProjectTaskDto>>(201);

        group.MapGet("/projects/{projectId:int}/tasks", async (int projectId, IMediator mediator, bool groupByStage = true) =>
        {
            var query = new GetTasksByProjectQuery
            {
                ProjectId = projectId,
                GroupByStage = groupByStage
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetTasksByProject")
        .Produces<ApiResponse<List<TaskKanbanDto>>>();

        group.MapGet("/tasks/{id:int}", async (int id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetTaskByIdQuery(id));
            return result is null
                ? Results.NotFound(ApiResponse<ProjectTaskDto>.Fail("Görev bulunamadı"))
                : Results.Ok(ApiResponse<ProjectTaskDto>.Ok(result));
        })
        .WithName("GetTaskById")
        .Produces<ApiResponse<ProjectTaskDto>>()
        .ProducesProblem(404);

        group.MapPut("/tasks/{id:int}", async (int id, UpdateTaskCommand command, IMediator mediator) =>
        {
            var updated = command with { Id = id };
            var result = await mediator.Send(updated);
            return Results.Ok(ApiResponse<ProjectTaskDto>.Ok(result));
        })
        .WithName("UpdateTask")
        .Produces<ApiResponse<ProjectTaskDto>>();

        group.MapPatch("/tasks/{id:int}/stage", async (int id, MoveTaskStageRequest body, IMediator mediator) =>
        {
            var command = new MoveTaskStageCommand(id, body.StageId);
            await mediator.Send(command);
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("MoveTaskStage")
        .Produces<ApiResponse<bool>>();

        group.MapDelete("/tasks/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteTaskCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteTask")
        .Produces<ApiResponse<bool>>();
    }
}

public record MoveTaskStageRequest(int StageId);
