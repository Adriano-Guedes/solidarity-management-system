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
            CreateMap<Item, ItemResponse>().ReverseMap();
            CreateMap<CreateItemRequest, Item>().ReverseMap();
            CreateMap<UpdateItemRequest, Item>().ReverseMap();
        }
    }
}
