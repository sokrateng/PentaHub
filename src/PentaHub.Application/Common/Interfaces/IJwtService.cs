using PentaHub.Domain.Entities;

namespace PentaHub.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
    bool ValidateRefreshToken(string token);
}
