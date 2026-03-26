using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.InventoryBatches.Request
{
    public class InventoryBatchDeliveryDonationRequest
    {
        [Required(ErrorMessage = "O ID do lote de inventário é obrigatório.")]
        public Guid InventoryBatchId { get; set; }
        [Required(ErrorMessage = "A quantidade é obrigatória.")]
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade disponível deve ser um número positivo.")]
        public int Quantity { get; set; }
    }
}
