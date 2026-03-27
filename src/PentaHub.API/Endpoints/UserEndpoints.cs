using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.API.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").WithTags("Users");

        group.MapGet("/", async (IApplicationDbContext context, IMapper mapper) =>
        {
            var users = await context.Users
                .Where(u => u.IsActive)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            var dtos = mapper.Map<List<UserDto>>(users);
            return Results.Ok(ApiResponse<List<UserDto>>.Ok(dtos));
        })
        .WithName("GetUsers")
        .Produces<ApiResponse<List<UserDto>>>();
    }
}
