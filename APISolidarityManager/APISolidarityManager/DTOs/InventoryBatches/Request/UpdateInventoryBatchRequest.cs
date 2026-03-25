using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.InventoryBatches.Request
{
    public class UpdateInventoryBatchRequest
    {
        [Required(ErrorMessage = "Doador é obrigatório.")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Doador é obrigatório.")]
        public Guid ItemId { get; set; }
        [StringLength(20, ErrorMessage = "A etiqueta não pode exceder 20 caracteres.")]
        public string? Tag { get; set; }
        public DateTime? ExpirationDate { get; set; }
        [Required(ErrorMessage = "Quantidade disponível é obrigatória.")]
        [Range(0, int.MaxValue, ErrorMessage = "A quantidade disponível deve ser um número positivo.")]
        public int QuantityAvailable { get; set; }
    }
}
