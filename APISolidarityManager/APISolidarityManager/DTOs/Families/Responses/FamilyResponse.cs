namespace APISolidarityManager.DTOs.Families.Responses
{
    public class FamilyResponse
    {
        public Guid Id { get; set; }
        public string ResponsibleName { get; set; } = null!;
        public string? ResponsibleDocument { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public decimal? MonthlyIncome { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
