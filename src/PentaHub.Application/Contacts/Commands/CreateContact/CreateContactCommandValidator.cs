using FluentValidation;

namespace PentaHub.Application.Contacts.Commands.CreateContact;

public class CreateContactCommandValidator : AbstractValidator<CreateContactCommand>
{
    public CreateContactCommandValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Firma adı zorunludur.")
            .MaximumLength(300).WithMessage("Firma adı en fazla 300 karakter olabilir.");

        RuleFor(x => x.ContactPersonName)
            .MaximumLength(200).When(x => x.ContactPersonName != null);

        RuleFor(x => x.Email)
            .MaximumLength(200)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("Geçerli bir e-posta adresi giriniz.");

        RuleFor(x => x.Phone)
            .MaximumLength(50).When(x => x.Phone != null);

        RuleFor(x => x.Mobile)
            .MaximumLength(50).When(x => x.Mobile != null);

        RuleFor(x => x.Website)
            .MaximumLength(300).When(x => x.Website != null);

        RuleFor(x => x.Address)
            .MaximumLength(500).When(x => x.Address != null);

        RuleFor(x => x.City)
            .MaximumLength(100).When(x => x.City != null);

        RuleFor(x => x.Country)
            .MaximumLength(100).When(x => x.Country != null);

        RuleFor(x => x.Tags)
            .MaximumLength(500).When(x => x.Tags != null);
    }
}
