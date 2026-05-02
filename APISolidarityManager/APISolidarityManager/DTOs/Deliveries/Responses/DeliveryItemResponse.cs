namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryItemResponse
    {
        public Guid InventoryBatchId { get; set; }
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public Guid ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
