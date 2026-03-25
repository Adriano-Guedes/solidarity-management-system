using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.InventoryBatches.Response
{
    public class InventoryBatchResponse
    {
        public Guid Id { get; set; }
        public Guid ItemId { get; set; }
        public string? Tag { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int QuantityAvailable { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Item Item { get; set; } = null!;
    }
}
