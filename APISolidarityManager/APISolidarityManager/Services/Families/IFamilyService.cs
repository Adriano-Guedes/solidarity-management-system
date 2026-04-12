using APISolidarityManager.DTOs.Families.Requests;
using APISolidarityManager.DTOs.Families.Responses;

namespace APISolidarityManager.Services.Families
{
    public interface IFamilyService
    {
        Task<IEnumerable<FamilyResponse>> GetAllAsync();
        Task<FamilyResponse> GetByIdAsync(Guid id);
        Task<FamilyResponse> CreateAsync(CreateFamilyRequest request);
        Task<FamilyResponse> UpdateAsync(Guid id, UpdateFamilyRequest request);
        Task DeleteAsync(Guid id);
    }
}
