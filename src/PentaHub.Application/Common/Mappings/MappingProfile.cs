using AutoMapper;
using PentaHub.Domain.Entities;
using PentaHub.Application.DTOs;

namespace PentaHub.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Project, ProjectDto>()
            .ForMember(d => d.ProjectManagerName, opt => opt.MapFrom(s => s.ProjectManager.FullName));

        CreateMap<Project, ProjectListDto>()
            .ForMember(d => d.ProjectManagerName, opt => opt.MapFrom(s => s.ProjectManager.FullName))
            .ForMember(d => d.TaskCount, opt => opt.Ignore());

        CreateMap<User, UserDto>();

        CreateMap<Contact, ContactDto>();
        CreateMap<Contact, ContactListDto>();
    }
}
