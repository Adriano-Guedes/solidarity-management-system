namespace APISolidarityManager.Models
{
    public class Delivery
    {
        public Guid Id { get; set; }

        public Guid FamilyId { get; set; }

        public DateTime DeliveryDate { get; set; }

        public Guid CreatedBy { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Family Family { get; set; } = null!;

        public User CreatedByUser { get; set; } = null!;

        public ICollection<DeliveryInventoryItem> DeliveryInventoryItems { get; set; } = new List<DeliveryInventoryItem>();
    }
}
