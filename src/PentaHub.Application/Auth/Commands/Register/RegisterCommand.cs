using MediatR;
using PentaHub.Application.Auth.DTOs;

namespace PentaHub.Application.Auth.Commands.Register;

public record RegisterCommand : IRequest<LoginResponse>
{
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? Department { get; init; }
}
