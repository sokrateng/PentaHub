using AutoMapper;
using MediatR;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Contacts.Commands.CreateContact;

public class CreateContactCommandHandler : IRequestHandler<CreateContactCommand, ContactDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateContactCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ContactDto> Handle(CreateContactCommand request, CancellationToken cancellationToken)
    {
        var contact = new Contact
        {
            CompanyName = request.CompanyName,
            ContactPersonName = request.ContactPersonName,
            Email = request.Email,
            Phone = request.Phone,
            Mobile = request.Mobile,
            Website = request.Website,
            Address = request.Address,
            City = request.City,
            Country = request.Country,
            Tags = request.Tags
        };

        _context.Contacts.Add(contact);
        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ContactDto>(contact);
    }
}
