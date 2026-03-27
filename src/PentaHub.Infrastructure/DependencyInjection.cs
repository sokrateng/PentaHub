using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Infrastructure.Data;

namespace PentaHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<PentaHubDbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<PentaHubDbContext>());

        return services;
    }
}
