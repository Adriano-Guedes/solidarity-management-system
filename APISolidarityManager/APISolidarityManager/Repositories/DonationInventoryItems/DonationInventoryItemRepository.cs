using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.DonationInventoryItems
{
    public class DonationInventoryItemRepository : Repository<DonationInventoryItem>, IDonationInventoryItemRepository
    {
        public DonationInventoryItemRepository(AppDbContext context) : base(context)
        {
        }
    }
}
