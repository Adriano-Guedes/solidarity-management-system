namespace APISolidarityManager.Models
{
    public class Delivery
    {
        public Guid Id { get; set; }

        public Guid BeneficiaryId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Beneficiary Beneficiary { get; set; } = null!;
        public User CreatedByUser { get; set; } = null!;

        public ICollection<DeliveryItem> DeliveryItems { get; set; } = new List<DeliveryItem>();
    }
}
