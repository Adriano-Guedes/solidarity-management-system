using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Logs.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class LogProfile : Profile
    {
        public LogProfile()
        {
            #region RESPONSE
            CreateMap<Log, LogResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
