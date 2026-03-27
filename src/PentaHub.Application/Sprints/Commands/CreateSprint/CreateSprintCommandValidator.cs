using FluentValidation;

namespace PentaHub.Application.Sprints.Commands.CreateSprint;

public class CreateSprintCommandValidator : AbstractValidator<CreateSprintCommand>
{
    public CreateSprintCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Sprint adı zorunludur.")
            .MaximumLength(200).WithMessage("Sprint adı en fazla 200 karakter olabilir.");

        RuleFor(x => x.ProjectId)
            .GreaterThan(0).WithMessage("Proje seçilmelidir.");

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate).WithMessage("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
    }
}
