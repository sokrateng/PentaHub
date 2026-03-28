using MediatR;

namespace PentaHub.Application.Auth.Commands.ChangePassword;

public record ChangePasswordCommand : IRequest<bool>
{
    public int UserId { get; init; }
    public string CurrentPassword { get; init; } = string.Empty;
    public string NewPassword { get; init; } = string.Empty;
}
