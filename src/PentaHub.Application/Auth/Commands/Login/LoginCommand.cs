using MediatR;
using PentaHub.Application.Auth.DTOs;

namespace PentaHub.Application.Auth.Commands.Login;

public record LoginCommand : IRequest<LoginResponse>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
