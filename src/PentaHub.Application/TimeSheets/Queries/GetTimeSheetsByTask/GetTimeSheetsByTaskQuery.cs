using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.TimeSheets.Queries.GetTimeSheetsByTask;

public record GetTimeSheetsByTaskQuery(int TaskId) : IRequest<ApiResponse<List<TimeSheetDto>>>;
