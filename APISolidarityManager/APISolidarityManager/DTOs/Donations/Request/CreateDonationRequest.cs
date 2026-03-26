using APISolidarityManager.DTOs.InventoryBatches.Request;
using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Donations.Request
{
    public class CreateDonationRequest
    {
        [Required(ErrorMessage = "Doador é obrigatório.")]
        public Guid DonorId { get; set; }
        [Required(ErrorMessage = "Data de recebimento é obrigatória.")]
        public DateTime ReceivedDate { get; set; }
        [StringLength(500, ErrorMessage = "A observação não pode exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public List<InventoryBatchDeliveryDonationRequest> Items { get; set; } = new List<InventoryBatchDeliveryDonationRequest>();
    }
}
