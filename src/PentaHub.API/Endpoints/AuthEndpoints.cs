using System.Security.Claims;
using MediatR;
using PentaHub.Application.Auth.Commands.Login;
using PentaHub.Application.Auth.Commands.Register;
using PentaHub.Application.Auth.Commands.RefreshToken;
using PentaHub.Application.Auth.Commands.ChangePassword;
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
                Department = request.Department,
                Role = request.Role
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

        group.MapPost("/change-password", async (ChangePasswordRequest request, IMediator mediator, ClaimsPrincipal claimsPrincipal) =>
        {
            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? claimsPrincipal.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var callerUserId))
                return Results.Unauthorized();

            // Allow changing own password only (admins could override but not implemented here)
            var targetUserId = request.UserId > 0 ? request.UserId : callerUserId;
            if (targetUserId != callerUserId)
                return Results.Forbid();

            try
            {
                var command = new ChangePasswordCommand
                {
                    UserId = targetUserId,
                    CurrentPassword = request.CurrentPassword,
                    NewPassword = request.NewPassword
                };
                await mediator.Send(command);
                return Results.Ok(ApiResponse<bool>.Ok(true));
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(ApiResponse<bool>.Fail(ex.Message));
            }
        })
        .WithName("ChangePassword")
        .RequireAuthorization()
        .Produces<ApiResponse<bool>>();

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
