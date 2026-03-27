using System.Security.Claims;
using MediatR;
using PentaHub.Application.Auth.Commands.Login;
using PentaHub.Application.Auth.Commands.Register;
using PentaHub.Application.Auth.Commands.RefreshToken;
using PentaHub.Application.Auth.DTOs;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/login", async (LoginRequest request, IMediator mediator) =>
        {
            var command = new LoginCommand { Email = request.Email, Password = request.Password };
            var result = await mediator.Send(command);
            return Results.Ok(ApiResponse<LoginResponse>.Ok(result));
        })
        .WithName("Login")
        .Produces<ApiResponse<LoginResponse>>();

        group.MapPost("/register", async (RegisterRequest request, IMediator mediator) =>
        {
            var command = new RegisterCommand
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                Department = request.Department
            };
            var result = await mediator.Send(command);
            return Results.Created("/api/auth/me", ApiResponse<LoginResponse>.Ok(result));
        })
        .WithName("Register")
        .Produces<ApiResponse<LoginResponse>>(201);

        group.MapPost("/refresh", async (RefreshTokenCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Ok(ApiResponse<LoginResponse>.Ok(result));
        })
        .WithName("RefreshToken")
        .Produces<ApiResponse<LoginResponse>>();

        group.MapGet("/me", async (ClaimsPrincipal claimsPrincipal, IApplicationDbContext context) =>
        {
            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? claimsPrincipal.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Results.Unauthorized();

            var user = await context.Users
                .IgnoreQueryFilters()
                .Where(u => u.Id == userId && !u.IsDeleted)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    AvatarUrl = u.AvatarUrl,
                    Role = u.Role,
                    Department = u.Department
                })
                .FirstOrDefaultAsync();

            if (user is null)
                return Results.NotFound(ApiResponse<UserDto>.Fail("Kullanıcı bulunamadı."));

            return Results.Ok(ApiResponse<UserDto>.Ok(user));
        })
        .WithName("GetCurrentUser")
        .RequireAuthorization()
        .Produces<ApiResponse<UserDto>>();
    }
}
