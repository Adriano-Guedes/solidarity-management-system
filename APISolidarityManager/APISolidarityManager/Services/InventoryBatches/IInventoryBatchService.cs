using APISolidarityManager.DTOs.InventoryBatches.Requests;
using APISolidarityManager.DTOs.InventoryBatches.Responses;

namespace APISolidarityManager.Services.InventoryBatches
{
    public interface IInventoryBatchService
    {
        Task<IEnumerable<InventoryBatchResponse>> GetAllAsync();
        Task<InventoryBatchResponse> GetByIdAsync(Guid id);
        Task<IEnumerable<InventoryBatchResponse>> GetByItemIdAsync(Guid itemId);
        Task<InventoryBatchResponse> UpdateAsync(Guid id, UpdateInventoryBatchRequest request);
    }
}
