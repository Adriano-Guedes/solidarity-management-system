using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Families.Requests;
using APISolidarityManager.DTOs.Families.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class FamilyProfile : Profile
    {
        public FamilyProfile()
        {
            #region REQUEST
            CreateMap<CreateFamilyRequest, Family>().ReverseMap();
            
            CreateMap<UpdateFamilyRequest, Family>().ReverseMap();
            #endregion

            #region RESPONSE
            CreateMap<Family, FamilyResponse>().ReverseMap()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
