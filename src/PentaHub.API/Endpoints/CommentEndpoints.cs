using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Comments.Commands.AddComment;
using PentaHub.Application.Comments.Commands.DeleteComment;
using PentaHub.Application.Comments.Queries.GetCommentsByEntity;

namespace PentaHub.API.Endpoints;

public static class CommentEndpoints
{
    public static void MapCommentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").WithTags("Comments");

        group.MapPost("/comments", async (AddCommentCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/comments/{result.Id}", ApiResponse<CommentDto>.Ok(result));
        })
        .WithName("AddComment")
        .Produces<ApiResponse<CommentDto>>(201);

        group.MapGet("/{entityType}/{entityId:int}/comments", async (string entityType, int entityId, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetCommentsByEntityQuery(entityType, entityId));
            return Results.Ok(ApiResponse<List<CommentDto>>.Ok(result));
        })
        .WithName("GetCommentsByEntity")
        .Produces<ApiResponse<List<CommentDto>>>();

        group.MapDelete("/comments/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteCommentCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteComment")
        .Produces<ApiResponse<bool>>();
    }
}
