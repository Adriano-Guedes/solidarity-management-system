namespace APISolidarityManager.Models
{
    public class Donor
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string? DocumentNumber { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Notes { get; set; }

        public bool Active { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Donation> Donations { get; set; } = new List<Donation>();
    }
}
