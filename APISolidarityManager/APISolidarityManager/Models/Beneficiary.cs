namespace APISolidarityManager.Models
{
    public class Beneficiary
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string DocumentNumber { get; set; } = null!;
        public DateTime BirthDate { get; set; }

        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }

        public bool Active { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    }
}
