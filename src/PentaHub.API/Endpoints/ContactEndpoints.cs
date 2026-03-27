using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.Contacts.Commands.CreateContact;
using PentaHub.Application.Contacts.Commands.DeleteContact;
using PentaHub.Application.Contacts.Commands.UpdateContact;
using PentaHub.Application.Contacts.Queries.GetContactById;
using PentaHub.Application.Contacts.Queries.GetContactList;
using PentaHub.Application.DTOs;

namespace PentaHub.API.Endpoints;

public static class ContactEndpoints
{
    public static void MapContactEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contacts").WithTags("Contacts");

        group.MapGet("/", async (
            IMediator mediator,
            string? search = null,
            string? city = null,
            string? country = null,
            int page = 1,
            int pageSize = 50) =>
        {
            var query = new GetContactListQuery
            {
                Search = search,
                City = city,
                Country = country,
                Page = page > 0 ? page : 1,
                PageSize = pageSize > 0 ? pageSize : 50
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetContacts")
        .Produces<ApiResponse<List<ContactListDto>>>();

        group.MapGet("/{id:int}", async (int id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetContactByIdQuery(id));
            return result is null
                ? Results.NotFound(ApiResponse<ContactDto>.Fail("Kontak bulunamadı"))
                : Results.Ok(ApiResponse<ContactDto>.Ok(result));
        })
        .WithName("GetContactById")
        .Produces<ApiResponse<ContactDto>>()
        .ProducesProblem(404);

        group.MapPost("/", async (CreateContactCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/contacts/{result.Id}", ApiResponse<ContactDto>.Ok(result));
        })
        .WithName("CreateContact")
        .Produces<ApiResponse<ContactDto>>(201);

        group.MapPut("/{id:int}", async (int id, UpdateContactCommand command, IMediator mediator) =>
        {
            var updated = command with { Id = id };
            var result = await mediator.Send(updated);
            return Results.Ok(ApiResponse<ContactDto>.Ok(result));
        })
        .WithName("UpdateContact")
        .Produces<ApiResponse<ContactDto>>();

        group.MapDelete("/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteContactCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteContact")
        .Produces<ApiResponse<bool>>();
    }
}
