namespace APISolidarityManager.DTOs.InventoryBatches.Responses
{
    public class InventoryBatchResponse
    {
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int QuantityAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
