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
            CreateMap<CreateFamilyRequest, Family>();
            
            CreateMap<UpdateFamilyRequest, Family>();
            #endregion

            #region RESPONSE
            CreateMap<Family, FamilyResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
