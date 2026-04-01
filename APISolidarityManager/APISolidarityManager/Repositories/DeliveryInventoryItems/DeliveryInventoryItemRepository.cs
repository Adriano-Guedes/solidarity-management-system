using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.DeliveryInventoryItems
{
    public class DeliveryInventoryItemRepository : Repository<DeliveryInventoryItem>, IDeliveryInventoryItemRepository
    {
        public DeliveryInventoryItemRepository(AppDbContext context) : base(context)
        {
        }
    }
}
