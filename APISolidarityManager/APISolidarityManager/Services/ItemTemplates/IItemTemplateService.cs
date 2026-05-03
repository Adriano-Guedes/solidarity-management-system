using APISolidarityManager.DTOs.ItemTemplates.Requests;
using APISolidarityManager.DTOs.ItemTemplates.Responses;

namespace APISolidarityManager.Services.ItemTemplates
{
    public interface IItemTemplateService
    {
        Task<IEnumerable<ItemTemplateResponse>> GetAllAsync();
        Task<IEnumerable<ItemTemplateResponse>> GetAllActiveAsync();
        Task<ItemTemplateResponse> GetByIdAsync(Guid id);
        Task<ItemTemplateResponse> CreateAsync(CreateItemTemplateRequest request);
        Task<ItemTemplateResponse> UpdateAsync(Guid id, UpdateItemTemplateRequest request);
        Task<ItemTemplateResponse> DeleteAsync(Guid id);
    }
}
