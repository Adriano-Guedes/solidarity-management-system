namespace APISolidarityManager.Models
{
    public class Family
    {
        public Guid Id { get; set; }

        public string ResponsibleName { get; set; } = null!;

        public string? ResponsibleDocument { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public decimal? MonthlyIncome { get; set; }

        public string? Notes { get; set; }

        public bool Active { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();

        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    }
}
