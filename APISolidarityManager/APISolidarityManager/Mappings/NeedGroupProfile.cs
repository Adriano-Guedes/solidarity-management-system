using APISolidarityManager.DTOs.NeedGroups.Requests;
using APISolidarityManager.DTOs.NeedGroups.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class NeedGroupProfile : Profile
    {
        public NeedGroupProfile()
        {
            CreateMap<CreateNeedGroupRequest, NeedGroup>();
            CreateMap<UpdateNeedGroupRequest, NeedGroup>();
            CreateMap<NeedGroup, NeedGroupResponse>();
        }
    }
}
