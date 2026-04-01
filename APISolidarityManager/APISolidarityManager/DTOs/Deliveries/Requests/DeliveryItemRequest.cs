using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Deliveries.Requests
{
    public class DeliveryItemRequest
    {
        [Required(ErrorMessage = "O lote de estoque é obrigatório.")]
        public Guid InventoryBatchId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantity { get; set; }
    }
}
