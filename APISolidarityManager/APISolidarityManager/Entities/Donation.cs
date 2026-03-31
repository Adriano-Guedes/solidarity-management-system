namespace APISolidarityManager.Models
{
    public class Donation
    {
        public Guid Id { get; set; }

        public DateTime ReceivedDate { get; set; }

        public Guid CreatedBy { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public User CreatedByUser { get; set; } = null!;

        public ICollection<DonationInventoryItem> DonationInventoryItems { get; set; } = new List<DonationInventoryItem>();
    }
}
