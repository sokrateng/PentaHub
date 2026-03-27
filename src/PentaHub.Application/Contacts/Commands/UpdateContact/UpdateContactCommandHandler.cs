using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Contacts.Commands.UpdateContact;

public class UpdateContactCommandHandler : IRequestHandler<UpdateContactCommand, ContactDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateContactCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ContactDto> Handle(UpdateContactCommand request, CancellationToken cancellationToken)
    {
        var contact = await _context.Contacts
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Kontak bulunamadı: {request.Id}");

        contact.CompanyName = request.CompanyName;
        contact.ContactPersonName = request.ContactPersonName;
        contact.Email = request.Email;
        contact.Phone = request.Phone;
        contact.Mobile = request.Mobile;
        contact.Website = request.Website;
        contact.Address = request.Address;
        contact.City = request.City;
        contact.Country = request.Country;
        contact.Tags = request.Tags;

        await _context.SaveChangesAsync(cancellationToken);

        return _mapper.Map<ContactDto>(contact);
    }
}
