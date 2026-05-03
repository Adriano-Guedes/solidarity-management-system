using APISolidarityManager.DTOs.AgeRanges.Requests;
using APISolidarityManager.DTOs.AgeRanges.Responses;

namespace APISolidarityManager.Services.AgeRanges
{
    public interface IAgeRangeService
    {
        Task<IEnumerable<AgeRangeResponse>> GetAllAsync();
        Task<IEnumerable<AgeRangeResponse>> GetAllActiveAsync();
        Task<AgeRangeResponse> GetByIdAsync(Guid id);
        Task<AgeRangeResponse> CreateAsync(CreateAgeRangeRequest request);
        Task<AgeRangeResponse> UpdateAsync(Guid id, UpdateAgeRangeRequest request);
        Task<AgeRangeResponse> DeleteAsync(Guid id);
    }
}
