using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;

namespace PentaHub.Application.Auth.Commands.ChangePassword;

public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ChangePasswordCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .Where(u => u.Id == request.UserId && !u.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
            throw new InvalidOperationException("Kullanıcı bulunamadı.");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Mevcut şifre hatalı.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
