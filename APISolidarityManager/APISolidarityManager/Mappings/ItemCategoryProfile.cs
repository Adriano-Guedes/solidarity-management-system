using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.ItemCategories.Requests;
using APISolidarityManager.DTOs.ItemCategories.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class ItemCategoryProfile : Profile
    {
        public ItemCategoryProfile()
        {
            #region REQUEST
            CreateMap<CreateItemCategoryRequest, ItemCategory>();
            
            CreateMap<UpdateItemCategoryRequest, ItemCategory>();
            #endregion

            #region RESPONSE
            CreateMap<ItemCategory, ItemCategoryResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
