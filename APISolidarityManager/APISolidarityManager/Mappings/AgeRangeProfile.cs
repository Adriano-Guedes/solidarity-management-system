using APISolidarityManager.DTOs.AgeRanges.Requests;
using APISolidarityManager.DTOs.AgeRanges.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class AgeRangeProfile : Profile
    {
        public AgeRangeProfile()
        {
            CreateMap<CreateAgeRangeRequest, AgeRange>();
            CreateMap<UpdateAgeRangeRequest, AgeRange>();
            CreateMap<AgeRange, AgeRangeResponse>();
        }
    }
}
