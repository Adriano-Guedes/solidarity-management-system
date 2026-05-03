using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.ItemTemplates.Requests;
using APISolidarityManager.DTOs.ItemTemplates.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class ItemTemplateProfile : Profile
    {
        public ItemTemplateProfile()
        {
            #region REQUEST
            CreateMap<CreateItemTemplateRequest, ItemTemplate>();
            CreateMap<UpdateItemTemplateRequest, ItemTemplate>()
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.NeedGroupId, opt => opt.MapFrom(src => src.NeedGroupId));
            #endregion

            #region RESPONSE
            CreateMap<ItemTemplate, ItemTemplateResponse>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.NeedGroupName, opt => opt.MapFrom(src => src.NeedGroup.Name))
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
