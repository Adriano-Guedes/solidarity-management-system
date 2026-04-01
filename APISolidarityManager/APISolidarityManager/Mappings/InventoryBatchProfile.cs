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
            CreateMap<InventoryBatch, InventoryBatchResponse>().ReverseMap();
            CreateMap<CreateInventoryBatchRequest, InventoryBatch>()
                .ForMember(dest => dest.QuantityAvailable, opt => opt.MapFrom(_ => 0));
            CreateMap<UpdateInventoryBatchRequest, InventoryBatch>();
        }
    }
}
