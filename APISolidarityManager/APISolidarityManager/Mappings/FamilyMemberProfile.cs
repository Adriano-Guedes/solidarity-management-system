using APISolidarityManager.DTOs.FamilyMembers.Requests;
using APISolidarityManager.DTOs.FamilyMembers.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class FamilyMemberProfile : Profile
    {
        public FamilyMemberProfile()
        {
            CreateMap<FamilyMember, FamilyMemberResponse>().ReverseMap();
            CreateMap<CreateFamilyMemberRequest, FamilyMember>().ReverseMap();
            CreateMap<UpdateFamilyMemberRequest, FamilyMember>().ReverseMap();
        }
    }
}
