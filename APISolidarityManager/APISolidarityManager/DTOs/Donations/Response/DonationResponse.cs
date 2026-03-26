using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.Donations.Response
{
    public class DonationResponse
    {
        public Guid Id { get; set; }
        public Guid DonorId { get; set; }
        public DateTime ReceivedDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Donor Donor { get; set; } = new Donor();
        public User CreatedByUser { get; set; } = new User();
    }
}
