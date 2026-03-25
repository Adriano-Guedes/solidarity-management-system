using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.DeliveryInventoryItems.Request
{
    public class UpdateDeliveryInventoryItemsRequest
    {
        [Required(ErrorMessage = "Entrega é obrigatória.")]
        public Guid DeliveryId { get; set; }
        [Required(ErrorMessage = "Item é obrigatório.")]
        public Guid InventoryBatchId { get; set; }
        [Required(ErrorMessage = "Quantidade é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que 0.")]
        public int Quantity { get; set; }
    }
}
