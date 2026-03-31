namespace APISolidarityManager.Models
{
    public class InventoryBatch
    {
        public Guid Id { get; set; }

        public Guid ItemId { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public int QuantityAvailable { get; set; } = 0;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Item Item { get; set; } = null!;

        public ICollection<DonationInventoryItem> DonationInventoryItems { get; set; } = new List<DonationInventoryItem>();

        public ICollection<DeliveryInventoryItem> DeliveryInventoryItems { get; set; } = new List<DeliveryInventoryItem>();
    }
}
