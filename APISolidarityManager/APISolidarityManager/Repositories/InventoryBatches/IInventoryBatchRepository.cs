using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.InventoryBatches
{
    public interface IInventoryBatchRepository : IRepository<InventoryBatch>
    {
        Task<IEnumerable<InventoryBatch>> GetByItemIdAsync(Guid itemId);
        Task<InventoryBatch?> GetByItemIdAndExpirationDateAsync(Guid itemId, DateTime? expirationDate);
        Task<bool> HasMovementsAsync(Guid inventoryBatchId);
        Task<IEnumerable<InventoryBatch>> GetAvailableOrderedByExpirationAsync(Guid itemId);
    }
}
