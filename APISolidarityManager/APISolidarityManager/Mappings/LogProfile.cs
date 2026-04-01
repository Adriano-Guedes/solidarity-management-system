using APISolidarityManager.DTOs.Logs.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class LogProfile : Profile
    {
        public LogProfile()
        {
            CreateMap<Log, LogResponse>();
        }
    }
}
