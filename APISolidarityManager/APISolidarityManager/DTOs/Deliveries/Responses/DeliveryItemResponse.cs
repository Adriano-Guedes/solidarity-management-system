namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryItemResponse
    {
        public Guid InventoryBatchId { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; }
    }
}
