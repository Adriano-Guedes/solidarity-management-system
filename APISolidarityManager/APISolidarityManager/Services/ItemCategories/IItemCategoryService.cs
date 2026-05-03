using APISolidarityManager.DTOs.ItemCategories.Requests;
using APISolidarityManager.DTOs.ItemCategories.Responses;

namespace APISolidarityManager.Services.ItemCategories
{
    public interface IItemCategoryService
    {
        Task<IEnumerable<ItemCategoryResponse>> GetAllAsync();
        Task<IEnumerable<ItemCategoryResponse>> GetAllActiveAsync();
        Task<ItemCategoryResponse> GetByIdAsync(Guid id);
        Task<ItemCategoryResponse> CreateAsync(CreateItemCategoryRequest request);
        Task<ItemCategoryResponse> UpdateAsync(Guid id, UpdateItemCategoryRequest request);
        Task<ItemCategoryResponse> DeleteAsync(Guid id);
    }
}
