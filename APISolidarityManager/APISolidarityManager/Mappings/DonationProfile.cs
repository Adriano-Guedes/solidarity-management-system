using APISolidarityManager.Common.Extensions;
using APISolidarityManager.DTOs.Donations.Requests;
using APISolidarityManager.DTOs.Donations.Responses;
using APISolidarityManager.Models;
using AutoMapper;

namespace APISolidarityManager.Mappings
{
    public class DonationProfile : Profile
    {
        public DonationProfile()
        {
            #region REQUEST
            CreateMap<DonationInventoryItem, DonationItemResponse>()
                .ForMember(dest => dest.InventoryBatchId, opt => opt.MapFrom(src => src.InventoryBatchId))
                .ForMember(dest => dest.ItemId, opt => opt.MapFrom(src => src.InventoryBatch.ItemId))
                .ForMember(dest => dest.ExpirationDate, opt => opt.MapFrom(src => src.InventoryBatch.ExpirationDate))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity));

            CreateMap<CreateDonationRequest, Donation>();
            #endregion

            #region RESPONSE
            CreateMap<Donation, DonationResponse>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.UpdatedAt,
                    opt => opt.MapFrom(src => src.UpdatedAt.ToSaoPauloTime()))
                .ForMember(dest => dest.Items,
                    opt => opt.MapFrom(src => src.DonationInventoryItems))
                .ForMember(dest => dest.CreatedByName,
                    opt => opt.MapFrom(src => src.CreatedByUser.Name));
            #endregion
        }
    }
}
