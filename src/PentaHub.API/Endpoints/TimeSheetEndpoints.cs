using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.TimeSheets.Commands.CreateTimeSheet;
using PentaHub.Application.TimeSheets.Commands.DeleteTimeSheet;
using PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByTask;
using PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByUser;

namespace PentaHub.API.Endpoints;

public static class TimeSheetEndpoints
{
    public static void MapTimeSheetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("TimeSheets");

        group.MapPost("/timesheets", async (CreateTimeSheetCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/timesheets/{result.Id}", ApiResponse<TimeSheetDto>.Ok(result));
        })
        .WithName("CreateTimeSheet")
        .Produces<ApiResponse<TimeSheetDto>>(201);

        group.MapGet("/tasks/{taskId:int}/timesheets", async (int taskId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetTimeSheetsByTaskQuery(taskId));
            return Results.Ok(result);
        })
        .WithName("GetTimeSheetsByTask")
        .Produces<ApiResponse<List<TimeSheetDto>>>();

        group.MapGet("/users/{userId:int}/timesheets", async (int userId, IMediator mediator, DateTime? startDate = null, DateTime? endDate = null) =>
        {
            var query = new GetTimeSheetsByUserQuery
            {
                UserId = userId,
                StartDate = startDate,
                EndDate = endDate
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetTimeSheetsByUser")
        .Produces<ApiResponse<List<TimeSheetDto>>>();

        group.MapDelete("/timesheets/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteTimeSheetCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteTimeSheet")
        .Produces<ApiResponse<bool>>();
    }
}
