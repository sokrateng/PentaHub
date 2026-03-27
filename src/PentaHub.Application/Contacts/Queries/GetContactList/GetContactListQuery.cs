using MediatR;
using PentaHub.Application.Common.Models;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Contacts.Queries.GetContactList;

public record GetContactListQuery : IRequest<ApiResponse<List<ContactListDto>>>
{
    public string? Search { get; init; }
    public string? City { get; init; }
    public string? Country { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 50;
}
