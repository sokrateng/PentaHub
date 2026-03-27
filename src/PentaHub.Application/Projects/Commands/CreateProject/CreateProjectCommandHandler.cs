using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;
using PentaHub.Domain.Entities;

namespace PentaHub.Application.Projects.Commands.CreateProject;

public class CreateProjectCommandHandler : IRequestHandler<CreateProjectCommand, ProjectDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CreateProjectCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProjectDto> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Status = request.Status,
            ProjectManagerId = request.ProjectManagerId,
            ContactId = request.ContactId,
            DepartmentName = request.DepartmentName,
            PrivacyLevel = request.PrivacyLevel,
            IsBillable = request.IsBillable,
            IsTemplate = request.IsTemplate,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            ProjectEmail = request.ProjectEmail,
            CustomerEvaluation = request.CustomerEvaluation,
            EvaluationFrequency = request.EvaluationFrequency
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync(cancellationToken);

        var created = await _context.Projects
            .Include(p => p.ProjectManager)
            .FirstAsync(p => p.Id == project.Id, cancellationToken);

        return _mapper.Map<ProjectDto>(created);
    }
}
