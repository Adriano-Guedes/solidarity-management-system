using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.InventoryBatches
{
    public class InventoryBatchService : IInventoryBatchService
    {
        private readonly IInventoryBatchRepository _inventoryBatchRepository;

        public InventoryBatchService(IInventoryBatchRepository inventoryBatchRepository)
        {
            _inventoryBatchRepository = inventoryBatchRepository;
        }
    }
}
