namespace APISolidarityManager.Models
{
    public class Item
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string? Notes { get; set; }

        public bool Active { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Inventory? Inventory { get; set; }

        public ICollection<DonationItem> DonationItems { get; set; } = new List<DonationItem>();
        public ICollection<DeliveryItem> DeliveryItems { get; set; } = new List<DeliveryItem>();
    }
}
