using PentaHub.Application;
using PentaHub.Infrastructure;
using PentaHub.Infrastructure.Data;
using PentaHub.API.Endpoints;
using Serilog;
using Microsoft.EntityFrameworkCore;
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
                _ => (500, "Beklenmeyen bir hata oluştu.")
            };

            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsJsonAsync(new { success = false, error = message });
        });
    });

    // Endpoints
    app.MapProjectEndpoints();
    app.MapUserEndpoints();

    // Auto-migrate and seed
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<PentaHubDbContext>();
        db.Database.Migrate();
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
