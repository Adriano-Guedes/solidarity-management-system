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
                    opt => opt.MapFrom(src => src.DeliveryInventoryItems
                        .GroupBy(di => di.InventoryBatch.ItemId)
                        .Select(g => new DeliveryItemResponse
                        {
                            ItemId = g.Key,
                            ItemName = g.First().InventoryBatch.Item.Name,
                            ItemCategoryId = g.First().InventoryBatch.Item.CategoryId,
                            ItemCategoryName = g.First().InventoryBatch.Item.Category.Name,
                            TotalQuantity = g.Sum(di => di.Quantity),
                            Batches = g.Select(di => new DeliveryBatchResponse
                            {
                                InventoryBatchId = di.InventoryBatchId,
                                Quantity = di.Quantity,
                                ExpirationDate = di.InventoryBatch.ExpirationDate
                            }).ToList()
                        })))
                .ForMember(dest => dest.FamilyResponsibleName,
                    opt => opt.MapFrom(src => src.Family.ResponsibleName))
                .ForMember(dest => dest.CreatedByName,
                    opt => opt.MapFrom(src => src.CreatedByUser.Name));
            #endregion
        }
    }
}
