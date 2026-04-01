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
            CreateMap<ItemCategory, ItemCategoryResponse>().ReverseMap();
            CreateMap<CreateItemCategoryRequest, ItemCategory>().ReverseMap();
            CreateMap<UpdateItemCategoryRequest, ItemCategory>().ReverseMap();
        }
    }
}
