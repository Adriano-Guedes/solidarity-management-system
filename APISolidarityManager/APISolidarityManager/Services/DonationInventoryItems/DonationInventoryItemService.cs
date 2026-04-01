using APISolidarityManager.Repositories.DonationInventoryItems;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.DonationInventoryItems
{
    public class DonationInventoryItemService : IDonationInventoryItemService
    {
        private readonly IDonationInventoryItemRepository _donationInventoryItemRepository;

        public DonationInventoryItemService(IDonationInventoryItemRepository donationInventoryItemRepository)
        {
            _donationInventoryItemRepository = donationInventoryItemRepository;
        }
    }
}
