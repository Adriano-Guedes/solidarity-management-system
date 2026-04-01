using APISolidarityManager.Repositories.DeliveryInventoryItems;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.DeliveryInventoryItems
{
    public class DeliveryInventoryItemService : IDeliveryInventoryItemService
    {
        private readonly IDeliveryInventoryItemRepository _deliveryInventoryItemRepository;

        public DeliveryInventoryItemService(IDeliveryInventoryItemRepository deliveryInventoryItemRepository)
        {
            _deliveryInventoryItemRepository = deliveryInventoryItemRepository;
        }
    }
}
