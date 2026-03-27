using FluentValidation;

namespace PentaHub.Application.Projects.Commands.CreateProject;

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Proje adı zorunludur.")
            .MaximumLength(300).WithMessage("Proje adı en fazla 300 karakter olabilir.");

        RuleFor(x => x.ProjectManagerId)
            .GreaterThan(0).WithMessage("Proje yöneticisi seçilmelidir.");

        RuleFor(x => x.DepartmentName)
            .MaximumLength(100);

        RuleFor(x => x.ProjectEmail)
            .MaximumLength(200)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.ProjectEmail));

        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue)
            .WithMessage("Bitiş tarihi başlangıç tarihinden sonra olmalıdır.");
    }
}
