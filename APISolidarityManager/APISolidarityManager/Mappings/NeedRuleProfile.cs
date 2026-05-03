using APISolidarityManager.DTOs.NeedRules.Requests;
using APISolidarityManager.DTOs.NeedRules.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class NeedRuleProfile : Profile
    {
        public NeedRuleProfile()
        {
            CreateMap<CreateNeedRuleRequest, NeedRule>();
            CreateMap<UpdateNeedRuleRequest, NeedRule>();
            CreateMap<NeedRule, NeedRuleResponse>()
                .ForMember(dest => dest.AgeRangeName, opt => opt.MapFrom(src => src.AgeRange.Name))
                .ForMember(dest => dest.NeedGroupName, opt => opt.MapFrom(src => src.NeedGroup.Name));
        }
    }
}
