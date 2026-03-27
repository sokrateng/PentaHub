using MediatR;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Contacts.Queries.GetContactById;

public record GetContactByIdQuery(int Id) : IRequest<ContactDto?>;
