using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.DTOs.Items.Responses;

namespace APISolidarityManager.Services.Items
{
    public interface IItemService
    {
        Task<IEnumerable<ItemResponse>> GetAllAsync();
        Task<IEnumerable<ItemResponse>> GetAllByCategoryAsync(Guid categoryId);
        Task<ItemResponse> GetByIdAsync(Guid id);
        Task<ItemResponse> CreateAsync(CreateItemRequest request);
        Task<ItemResponse> UpdateAsync(Guid id, UpdateItemRequest request);
        Task DeleteAsync(Guid id);
    }
}
