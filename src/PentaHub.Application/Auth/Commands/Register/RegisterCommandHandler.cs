using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Auth.DTOs;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, LoginResponse>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IMapper _mapper;

    public RegisterCommandHandler(IApplicationDbContext context, IJwtService jwtService, IMapper mapper)
    {
        _context = context;
        _jwtService = jwtService;
        _mapper = mapper;
    }

    public async Task<LoginResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (existingUser)
            throw new InvalidOperationException("Bu e-posta adresi zaten kullanılıyor.");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var validRoles = new[] { "User", "ProjectManager", "Admin" };
        var role = validRoles.Contains(request.Role) ? request.Role! : "User";

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = passwordHash,
            Department = request.Department,
            Role = role,
            IsActive = true,
            RefreshToken = refreshToken,
            RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        var token = _jwtService.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
