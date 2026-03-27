using MediatR;

namespace PentaHub.Application.Contacts.Commands.DeleteContact;

public record DeleteContactCommand(int Id) : IRequest;
