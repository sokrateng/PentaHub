using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Auth.DTOs;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;

    public LoginCommandHandler(IApplicationDbContext context, IJwtService jwtService, IMapper mapper)
    {
        _context = context;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted, cancellationToken)
            ?? throw new KeyNotFoundException("E-posta veya şifre hatalı.");

        if (!user.IsActive)
            throw new InvalidOperationException("Hesabınız aktif değil.");

        if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new KeyNotFoundException("E-posta veya şifre hatalı.");

        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
