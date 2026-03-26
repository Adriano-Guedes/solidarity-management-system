using APISolidarityManager.DTOs.InventoryBatches.Request;
using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Deliveries.Request
{
    public class CreateDeliveryRequest
    {
        [Required(ErrorMessage = "Beneficiário é obrigatório.")]
        public Guid BeneficiaryId { get; set; }
        [Required(ErrorMessage = "Data de entrega é obrigatória.")]
        public DateTime DeliveryDate { get; set; }
        [StringLength(500, ErrorMessage = "A observação não pode exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public List<InventoryBatchDeliveryDonationRequest> Items { get; set; } = new List<InventoryBatchDeliveryDonationRequest>();
    }
}
