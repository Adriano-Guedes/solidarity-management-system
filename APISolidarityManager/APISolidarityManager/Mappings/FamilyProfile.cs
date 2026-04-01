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
            CreateMap<Family, FamilyResponse>().ReverseMap();
            CreateMap<CreateFamilyRequest, Family>().ReverseMap();
            CreateMap<UpdateFamilyRequest, Family>().ReverseMap();
        }
    }
}
