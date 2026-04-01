using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.InventoryBatches
{
    public class InventoryBatchRepository : Repository<InventoryBatch>, IInventoryBatchRepository
    {
        public InventoryBatchRepository(AppDbContext context) : base(context)
        {
        }
    }
}
