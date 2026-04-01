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
            CreateMap<Delivery, DeliveryResponse>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.DeliveryInventoryItems));

            CreateMap<DeliveryInventoryItem, DeliveryItemResponse>();

            CreateMap<CreateDeliveryRequest, Delivery>();
            CreateMap<DeliveryItemRequest, DeliveryInventoryItem>();
        }
    }
}
