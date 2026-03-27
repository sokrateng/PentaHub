using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Contacts.Commands.UpdateContact;

public record UpdateContactCommand : IRequest<ContactDto>
{
    public int Id { get; init; }
    public string CompanyName { get; init; } = string.Empty;
    public string? ContactPersonName { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? Mobile { get; init; }
    public string? Website { get; init; }
    public string? Address { get; init; }
    public string? City { get; init; }
    public string? Country { get; init; }
    public string? Tags { get; init; }
}
