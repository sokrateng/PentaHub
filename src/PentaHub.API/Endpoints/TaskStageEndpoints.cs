using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;
using AutoMapper;

namespace PentaHub.API.Endpoints;

public static class TaskStageEndpoints
{
    public static void MapTaskStageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects/{projectId:int}/task-stages").WithTags("TaskStages");

        group.MapGet("/", async (int projectId, IApplicationDbContext context, IMapper mapper) =>
        {
            var stages = await context.TaskStages
                .Where(s => s.ProjectId == projectId)
                .OrderBy(s => s.SortOrder)
                .ToListAsync();

            var dtos = mapper.Map<List<TaskStageDto>>(stages);
            return Results.Ok(ApiResponse<List<TaskStageDto>>.Ok(dtos));
        })
        .WithName("GetTaskStages")
        .Produces<ApiResponse<List<TaskStageDto>>>();
    }
}
