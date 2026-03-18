namespace APISolidarityManager.Models
{
    public class Donation
    {
        public Guid Id { get; set; }
        public Guid DonorId { get; set; }
        public DateTime ReceivedDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
