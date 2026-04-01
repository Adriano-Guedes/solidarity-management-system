namespace APISolidarityManager.Models
{
    public class DonationInventoryItem
    {
        public Guid DonationId { get; set; }
        public Guid InventoryBatchId { get; set; }
        public int Quantity { get; set; }
        public Donation Donation { get; set; } = null!;
        public InventoryBatch InventoryBatch { get; set; } = null!;
    }
}
