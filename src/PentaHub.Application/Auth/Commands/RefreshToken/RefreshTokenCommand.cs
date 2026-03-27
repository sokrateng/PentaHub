using MediatR;
using PentaHub.Application.Auth.DTOs;

namespace PentaHub.Application.Auth.Commands.RefreshToken;

public record RefreshTokenCommand : IRequest<LoginResponse>
{
    public string RefreshToken { get; init; } = string.Empty;
}
