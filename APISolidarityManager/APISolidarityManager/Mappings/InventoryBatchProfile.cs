using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.InventoryBatches.Requests;
using APISolidarityManager.DTOs.InventoryBatches.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class InventoryBatchProfile : Profile
    {
        public InventoryBatchProfile() 
        {
            #region REQUEST
            CreateMap<CreateInventoryBatchRequest, InventoryBatch>()
                .ForMember(dest => dest.QuantityAvailable, opt => opt.MapFrom(_ => 0));
            
            CreateMap<UpdateInventoryBatchRequest, InventoryBatch>();
            #endregion

            #region RESPONSE
            CreateMap<InventoryBatch, InventoryBatchResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()));
            #endregion
        }
    }
}
