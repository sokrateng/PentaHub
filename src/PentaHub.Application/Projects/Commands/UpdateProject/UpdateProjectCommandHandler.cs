using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PentaHub.Application.Common.Interfaces;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Projects.Commands.UpdateProject;

public class UpdateProjectCommandHandler : IRequestHandler<UpdateProjectCommand, ProjectDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateProjectCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ProjectDto> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Proje bulunamadı: {request.Id}");

        project.Name = request.Name;
        project.Description = request.Description;
        project.Status = request.Status;
        project.ProjectManagerId = request.ProjectManagerId;
        project.ContactId = request.ContactId;
        project.DepartmentName = request.DepartmentName;
        project.PrivacyLevel = request.PrivacyLevel;
        project.IsBillable = request.IsBillable;
        project.IsTemplate = request.IsTemplate;
        project.StartDate = request.StartDate;
        project.EndDate = request.EndDate;
        project.ProjectEmail = request.ProjectEmail;
        project.CustomerEvaluation = request.CustomerEvaluation;
        project.EvaluationFrequency = request.EvaluationFrequency;

        await _context.SaveChangesAsync(cancellationToken);

        var updated = await _context.Projects
            .Include(p => p.ProjectManager)
            .FirstAsync(p => p.Id == project.Id, cancellationToken);

        return _mapper.Map<ProjectDto>(updated);
    }
}
