using APISolidarityManager.DTOs.Deliveries.Responses;

namespace APISolidarityManager.Services.Deliveries.DeliverySuggestions
{
    public interface IDeliverySuggestionService
    {
        Task<DeliverySuggestionResponse> GetDeliverySuggestionAsync(Guid familyId);
    }
}
