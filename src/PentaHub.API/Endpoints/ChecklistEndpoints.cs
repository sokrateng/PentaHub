using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Tasks.Commands.AddChecklistItem;
using PentaHub.Application.Tasks.Commands.DeleteChecklistItem;
using PentaHub.Application.Tasks.Commands.ToggleChecklistItem;
using PentaHub.Application.Tasks.Queries.GetChecklistByTask;

namespace PentaHub.API.Endpoints;

public static class ChecklistEndpoints
{
    public static void MapChecklistEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Checklists");

        group.MapPost("/tasks/{taskId:int}/checklists", async (int taskId, AddChecklistItemRequest body, IMediator mediator) =>
        {
            var command = new AddChecklistItemCommand
            {
                TaskId = taskId,
                Title = body.Title,
                AssigneeId = body.AssigneeId
            };
            var result = await mediator.Send(command);
            return Results.Created($"/api/checklists/{result.Id}", ApiResponse<TaskChecklistDto>.Ok(result));
        })
        .WithName("AddChecklistItem")
        .Produces<ApiResponse<TaskChecklistDto>>(201);

        group.MapGet("/tasks/{taskId:int}/checklists", async (int taskId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetChecklistByTaskQuery(taskId));
            return Results.Ok(ApiResponse<List<TaskChecklistDto>>.Ok(result));
        })
        .WithName("GetChecklistByTask")
        .Produces<ApiResponse<List<TaskChecklistDto>>>();

        group.MapPatch("/checklists/{id:int}/toggle", async (int id, IMediator mediator) =>
        {
            var result = await mediator.Send(new ToggleChecklistItemCommand(id));
            return Results.Ok(ApiResponse<TaskChecklistDto>.Ok(result));
        })
        .WithName("ToggleChecklistItem")
        .Produces<ApiResponse<TaskChecklistDto>>();

        group.MapDelete("/checklists/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteChecklistItemCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteChecklistItem")
        .Produces<ApiResponse<bool>>();
    }
}

public record AddChecklistItemRequest(string Title, int? AssigneeId);
