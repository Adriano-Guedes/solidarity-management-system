namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryItemResponse
    {
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public Guid ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; } = string.Empty;
        public int TotalQuantity { get; set; }
        public List<DeliveryBatchResponse> Batches { get; set; } = new();
    }
}
