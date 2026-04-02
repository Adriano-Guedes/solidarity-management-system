using APISolidarityManager.Common.Extensions;
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
            #region REQUEST
            CreateMap<CreateFamilyMemberRequest, FamilyMember>().ReverseMap();
            
            CreateMap<UpdateFamilyMemberRequest, FamilyMember>().ReverseMap();
            #endregion

            #region RESPONSE
            CreateMap<FamilyMember, FamilyMemberResponse>().ReverseMap()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
