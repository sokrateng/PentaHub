using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using PentaHub.Application.Projects.Commands.CreateProject;
using PentaHub.Application.Projects.Commands.UpdateProject;
using PentaHub.Application.Projects.Commands.DeleteProject;
using PentaHub.Application.Projects.Queries.GetProjectById;
using PentaHub.Application.Projects.Queries.GetProjectList;
using PentaHub.Application.Projects.Queries.GetProjectStats;
using PentaHub.Domain.Enums;

namespace PentaHub.API.Endpoints;

public static class ProjectEndpoints
{
    public static void MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects").WithTags("Projects");

        group.MapGet("/", async (
            IMediator mediator,
            ProjectStatus? status = null,
            int? managerId = null,
            string? search = null,
            bool? excludeTemplates = null,
            int page = 1,
            int pageSize = 50) =>
        {
            var query = new GetProjectListQuery
            {
                Status = status,
                ManagerId = managerId,
                Search = search,
                ExcludeTemplates = excludeTemplates,
                Page = page > 0 ? page : 1,
                PageSize = pageSize > 0 ? pageSize : 50
            };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetProjects")
        .Produces<ApiResponse<List<ProjectListDto>>>();

        group.MapGet("/stats", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetProjectStatsQuery());
            return Results.Ok(ApiResponse<ProjectStatsDto>.Ok(result));
        })
        .WithName("GetProjectStats")
        .Produces<ApiResponse<ProjectStatsDto>>();

        group.MapGet("/{id:int}", async (int id, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetProjectByIdQuery(id));
            return result is null
                ? Results.NotFound(ApiResponse<ProjectDto>.Fail("Proje bulunamadı"))
                : Results.Ok(ApiResponse<ProjectDto>.Ok(result));
        })
        .WithName("GetProjectById")
        .Produces<ApiResponse<ProjectDto>>()
        .ProducesProblem(404);

        group.MapPost("/", async (CreateProjectCommand command, IMediator mediator) =>
        {
            var result = await mediator.Send(command);
            return Results.Created($"/api/projects/{result.Id}", ApiResponse<ProjectDto>.Ok(result));
        })
        .WithName("CreateProject")
        .Produces<ApiResponse<ProjectDto>>(201);

        group.MapPut("/{id:int}", async (int id, UpdateProjectCommand command, IMediator mediator) =>
        {
            var updated = command with { Id = id };
            var result = await mediator.Send(updated);
            return Results.Ok(ApiResponse<ProjectDto>.Ok(result));
        })
        .WithName("UpdateProject")
        .Produces<ApiResponse<ProjectDto>>();

        group.MapDelete("/{id:int}", async (int id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteProjectCommand(id));
            return Results.Ok(ApiResponse<bool>.Ok(true));
        })
        .WithName("DeleteProject")
        .Produces<ApiResponse<bool>>();
    }
}
