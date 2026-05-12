namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryBatchResponse
    {
        public Guid InventoryBatchId { get; set; }
        public int Quantity { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
