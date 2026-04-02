using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.DTOs.Items.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class ItemProfile : Profile
    {
        public ItemProfile()
        {
            #region REQUEST
            CreateMap<CreateItemRequest, Item>().ReverseMap();
            
            CreateMap<UpdateItemRequest, Item>().ReverseMap();
            #endregion

            #region RESPONSE
            CreateMap<Item, ItemResponse>().ReverseMap()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
