namespace APISolidarityManager.Models
{
    public class DeliveryInventoryItem
    {
        public Guid DeliveryId { get; set; }
        public Guid InventoryBatchId { get; set; }
        public int Quantity { get; set; }
        public Delivery Delivery { get; set; } = null!;
        public InventoryBatch InventoryBatch { get; set; } = null!;
    }
}
