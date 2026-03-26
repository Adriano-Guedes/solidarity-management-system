using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.DonationInventoryItems.Response
{
    public class DonationInventoryItemsResponse
    {
        public Guid DonationId { get; set; }
        public Guid InventoryBatchId { get; set; }
        public int Quantity { get; set; }

        public InventoryBatch InventoryBatch { get; set; } = null!;
    }
}
