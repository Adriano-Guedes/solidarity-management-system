namespace APISolidarityManager.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public bool Active { get; set; }
        public Guid RoleId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Role Role { get; set; } = null!;

        public ICollection<Donation> DonationsCreated { get; set; } = new List<Donation>();
        public ICollection<Delivery> DeliveriesCreated { get; set; } = new List<Delivery>();
    }
}
