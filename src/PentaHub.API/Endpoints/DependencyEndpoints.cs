using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Tasks.Commands.AddDependency;
using PentaHub.Application.Tasks.Commands.RemoveDependency;
using PentaHub.Application.Tasks.Queries.GetDependenciesByTask;
using PentaHub.Application.Tasks.Queries.GetGanttData;
using PentaHub.Domain.Enums;

namespace PentaHub.API.Endpoints;

public static class DependencyEndpoints
{
    public static void MapDependencyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Dependencies");

        group.MapPost("/tasks/{taskId:int}/dependencies", async (int taskId, AddDependencyRequest body, IMediator mediator) =>
        {
            var command = new AddDependencyCommand
            {
                TaskId = taskId,
                DependsOnTaskId = body.DependsOnTaskId,
                Type = body.Type
            };
            var result = await mediator.Send(command);
            return Results.Created($"/api/dependencies/{result.Id}", ApiResponse<TaskDependencyDto>.Ok(result));
        })
        .WithName("AddDependency")
        .Produces<ApiResponse<TaskDependencyDto>>(201);

        group.MapGet("/tasks/{taskId:int}/dependencies", async (int taskId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetDependenciesByTaskQuery(taskId));
            return Results.Ok(ApiResponse<List<TaskDependencyDto>>.Ok(result));
        })
        .WithName("GetDependenciesByTask")
        .Produces<ApiResponse<List<TaskDependencyDto>>>();

        group.MapDelete("/dependencies/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new RemoveDependencyCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("RemoveDependency")
        .Produces<ApiResponse<bool>>();

        group.MapGet("/projects/{projectId:int}/gantt", async (int projectId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetGanttDataQuery(projectId));
            return Results.Ok(ApiResponse<List<GanttTaskDto>>.Ok(result));
        })
        .WithName("GetGanttData")
        .Produces<ApiResponse<List<GanttTaskDto>>>();
    }
}

public record AddDependencyRequest(int DependsOnTaskId, DependencyType Type = DependencyType.FinishToStart);
