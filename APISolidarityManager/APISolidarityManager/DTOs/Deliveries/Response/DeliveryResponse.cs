using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.Deliveries.Response
{
    public class DeliveryResponse
    {
        public Guid Id { get; set; }
        public Guid BeneficiaryId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Beneficiary Beneficiary { get; set; } = new Beneficiary();
        public User CreatedByUser { get; set; } = new User();
    }
}
