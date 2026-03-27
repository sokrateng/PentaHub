using Microsoft.EntityFrameworkCore;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Project> Projects { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
