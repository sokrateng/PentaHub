using FluentValidation;

namespace PentaHub.Application.Tasks.Commands.CreateTask;

public class CreateTaskCommandValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Görev başlığı zorunludur.")
            .MaximumLength(500).WithMessage("Görev başlığı en fazla 500 karakter olabilir.");

        RuleFor(x => x.ProjectId)
            .GreaterThan(0).WithMessage("Proje seçilmelidir.");
    }
}
