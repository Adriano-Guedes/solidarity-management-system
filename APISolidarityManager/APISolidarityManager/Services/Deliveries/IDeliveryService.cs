using APISolidarityManager.DTOs.Deliveries.Requests;
using APISolidarityManager.DTOs.Deliveries.Responses;

namespace APISolidarityManager.Services.Deliveries
{
    public interface IDeliveryService
    {
        Task<IEnumerable<DeliveryResponse>> GetAllAsync();
        Task<IEnumerable<DeliveryResponse>> GetAllByFamilyIdAsync(Guid familyId);
        Task<DeliveryResponse> GetByIdAsync(Guid id);
        Task<DeliveryResponse> CreateAsync(CreateDeliveryRequest request, Guid createdBy);
    }
}
