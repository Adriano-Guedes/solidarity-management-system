using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Deliveries.Requests
{
    public class CreateDeliveryRequest
    {
        [Required(ErrorMessage = "A família é obrigatória.")]
        public Guid FamilyId { get; set; }

        [Required(ErrorMessage = "A data da entrega é obrigatória.")]
        public DateTime DeliveryDate { get; set; }

        [StringLength(1000, ErrorMessage = "As observações devem ter no máximo 1000 caracteres.")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "A entrega deve conter ao menos um item.")]
        [MinLength(1, ErrorMessage = "A entrega deve conter ao menos um item.")]
        public ICollection<DeliveryItemRequest> Items { get; set; } = new List<DeliveryItemRequest>();
    }
}
