using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Auth.DTOs;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Auth.Commands.RefreshToken;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;

    public RefreshTokenCommandHandler(IApplicationDbContext context, IJwtService jwtService, IMapper mapper)
    {
        _context = context;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<LoginResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken && !u.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException("Geçersiz refresh token.");

        if (user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
            throw new InvalidOperationException("Refresh token süresi dolmuş. Lütfen tekrar giriş yapın.");

        if (!user.IsActive)
            throw new InvalidOperationException("Hesabınız aktif değil.");

        var newToken = _jwtService.GenerateToken(user);
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            Token = newToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
