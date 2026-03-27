using AutoMapper;
using PentaHub.Domain.Entities;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Common.Mappings;

public class TaskMappingProfile : Profile
{
    public TaskMappingProfile()
    {
        CreateMap<TaskStage, TaskStageDto>();

        CreateMap<ProjectTask, ProjectTaskDto>()
            .ForMember(d => d.ProjectName, opt => opt.MapFrom(s => s.Project.Name))
            .ForMember(d => d.StageName, opt => opt.MapFrom(s => s.Stage.Name))
            .ForMember(d => d.AssigneeName, opt => opt.MapFrom(s => s.Assignee != null ? s.Assignee.FullName : null))
            .ForMember(d => d.SubTaskCount, opt => opt.Ignore());
    }
}
