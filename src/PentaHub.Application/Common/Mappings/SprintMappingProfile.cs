using AutoMapper;
using PentaHub.Domain.Entities;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Common.Mappings;

public class SprintMappingProfile : Profile
{
    public SprintMappingProfile()
    {
        CreateMap<Sprint, SprintDto>()
            .ForMember(d => d.ProjectName, opt => opt.MapFrom(s => s.Project != null ? s.Project.Name : null))
            .ForMember(d => d.TaskCount, opt => opt.Ignore())
            .ForMember(d => d.CompletedTaskCount, opt => opt.Ignore());

        CreateMap<Sprint, SprintDetailDto>()
            .ForMember(d => d.ProjectName, opt => opt.MapFrom(s => s.Project != null ? s.Project.Name : null))
            .ForMember(d => d.TaskCount, opt => opt.Ignore())
            .ForMember(d => d.CompletedTaskCount, opt => opt.Ignore())
            .ForMember(d => d.Tasks, opt => opt.Ignore());
    }
}
