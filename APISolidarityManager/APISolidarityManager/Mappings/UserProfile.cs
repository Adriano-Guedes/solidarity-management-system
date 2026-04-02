using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Users.Requests;
using APISolidarityManager.DTOs.Users.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            #region REQUEST
            CreateMap<CreateUserRequest, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            
            CreateMap<UpdateUserRequest, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            #endregion

            #region RESPONSE
            CreateMap<User, UserResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
