using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Deliveries.Requests
{
    public class DeliveryItemRequest
    {
        [Required(ErrorMessage = "O item é obrigatório.")]
        public Guid ItemId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantity { get; set; }
    }
}
