using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Deliveries.Requests;
using APISolidarityManager.DTOs.Deliveries.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class DeliveryProfile : Profile
    {
        public DeliveryProfile()
        {
            #region REQUEST
            CreateMap<CreateDeliveryRequest, Delivery>();

            CreateMap<DeliveryItemRequest, DeliveryInventoryItem>();
            #endregion

            #region REPONSE
            CreateMap<Delivery, DeliveryResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.Items,
                    opt => opt.MapFrom(src => src.DeliveryInventoryItems));

            CreateMap<DeliveryInventoryItem, DeliveryItemResponse>()
                .ForMember(dest => dest.InventoryBatchId,
                    opt => opt.MapFrom(src => src.InventoryBatchId))
                .ForMember(dest => dest.ItemId,
                    opt => opt.MapFrom(src => src.InventoryBatch.ItemId))
                .ForMember(dest => dest.Quantity,
                    opt => opt.MapFrom(src => src.Quantity));
            #endregion
        }
    }
}
