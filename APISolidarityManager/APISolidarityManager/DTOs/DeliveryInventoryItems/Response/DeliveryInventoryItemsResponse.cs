using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.DeliveryInventoryItems.Response
{
    public class DeliveryInventoryItemsResponse
    {
        public Guid DeliveryId { get; set; }
        public Guid InventoryBatchId { get; set; }
        public int Quantity { get; set; }

        public InventoryBatch InventoryBatch { get; set; } = null!;
    }
}
