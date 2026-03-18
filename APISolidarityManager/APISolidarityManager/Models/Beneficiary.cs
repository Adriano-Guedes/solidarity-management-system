namespace APISolidarityManager.Models
{
    public class Beneficiary
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DocumentNumber { get; set; }
        public DateOnly BirthDate { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
