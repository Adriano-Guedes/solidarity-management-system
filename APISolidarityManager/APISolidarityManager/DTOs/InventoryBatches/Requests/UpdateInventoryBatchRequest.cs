using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.InventoryBatches.Requests
{
    public class UpdateInventoryBatchRequest
    {
        [Required(ErrorMessage = "O item é obrigatório.")]
        public Guid ItemId { get; set; }

        [DataType(DataType.Date, ErrorMessage = "A data de validade deve ser uma data válida.")]
        public DateTime? ExpirationDate { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "A quantidade não pode ser negativa.")]
        public int QuantityAvailable { get; set; }
    }
}
