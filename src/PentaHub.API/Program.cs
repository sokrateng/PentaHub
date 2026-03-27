using PentaHub.Application;
using PentaHub.Infrastructure;
using PentaHub.Infrastructure.Data;
using PentaHub.API.Endpoints;
using PentaHub.API.Hubs;
using PentaHub.API.Services;
using PentaHub.Application.Common.Interfaces;
using Serilog;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    // Services
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=pentahub.db";

    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(connectionString);

    // JWT Settings
    builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
    builder.Services.AddScoped<IJwtService, JwtService>();

    // JWT Authentication
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    var secret = jwtSettings["Secret"] ?? "PentaHub-Super-Secret-Key-That-Is-At-Least-32-Characters-Long-2025";

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"] ?? "PentaHub",
                ValidAudience = jwtSettings["Audience"] ?? "PentaHub-Web",
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
            };
        });

    builder.Services.AddAuthorization();

    // SignalR
    builder.Services.AddSignalR();
    builder.Services.AddScoped<IHubNotificationService, HubNotificationService>();

    // Swagger
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new() { Title = "PentaHub API", Version = "v1" });
    });

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    var app = builder.Build();

    // Middleware
    app.UseSerilogRequestLogging();
    app.UseCors("AllowFrontend");

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // Global error handler
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.ContentType = "application/json";
            var exceptionFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
            var exception = exceptionFeature?.Error;

            var (statusCode, message) = exception switch
            {
                ValidationException validationEx => (400, string.Join("; ", validationEx.Errors.Select(e => e.ErrorMessage))),
                KeyNotFoundException => (404, exception.Message),
                InvalidOperationException => (400, exception.Message),
                _ => (500, "Beklenmeyen bir hata oluştu.")
            };

            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(new { success = false, error = message });
        });
    });

    app.UseAuthentication();
    app.UseAuthorization();

    // Endpoints
    app.MapProjectEndpoints();
    app.MapUserEndpoints();
    app.MapTaskEndpoints();
    app.MapTaskStageEndpoints();
    app.MapSprintEndpoints();
    app.MapChecklistEndpoints();
    app.MapDependencyEndpoints();
    app.MapResourceEndpoints();
    app.MapMilestoneEndpoints();
    app.MapTimeSheetEndpoints();
    app.MapCommentEndpoints();
    app.MapContactEndpoints();
    app.MapAuthEndpoints();

    // SignalR Hub
    app.MapHub<CollaborationHub>("/hubs/collaboration");

    // Auto-migrate and seed (skip for InMemory database used in integration tests)
    using (var scope = app.Services.CreateScope())
    {
        var dbOptions = scope.ServiceProvider.GetRequiredService<DbContextOptions<PentaHubDbContext>>();
        var isInMemory = dbOptions.Extensions.Any(e =>
            e.GetType().Name.Contains("InMemory", StringComparison.OrdinalIgnoreCase));

        if (!isInMemory)
        {
            var db = scope.ServiceProvider.GetRequiredService<PentaHubDbContext>();
            db.Database.Migrate();
        }
    }

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application startup failed");
}
finally
{
    Log.CloseAndFlush();
}

// Required for WebApplicationFactory in integration tests
public partial class Program { }
