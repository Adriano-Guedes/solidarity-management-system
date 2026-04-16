using APISolidarityManager.DTOs.Donations.Requests;
using APISolidarityManager.DTOs.Donations.Responses;

namespace APISolidarityManager.Services.Donations
{
    public interface IDonationService
    {
        Task<IEnumerable<DonationResponse>> GetAllAsync();
        Task<DonationResponse> GetByIdAsync(Guid id);
        Task<DonationResponse> CreateAsync(CreateDonationRequest request, Guid createdBy);
    }
}
