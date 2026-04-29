using APISolidarityManager.DTOs.ItemTemplates.Responses;

namespace APISolidarityManager.Services.ItemTemplates
{
    public interface IItemTemplateService
    {
        Task<IEnumerable<ItemTemplateResponse>> GetAllAsync();
        Task<ItemTemplateResponse> GetByIdAsync(Guid id);
    }
}
