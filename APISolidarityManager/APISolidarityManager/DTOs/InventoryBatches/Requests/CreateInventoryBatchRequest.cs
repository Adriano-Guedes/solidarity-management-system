using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.InventoryBatches.Requests
{
    public class CreateInventoryBatchRequest
    {
        [Required(ErrorMessage = "O item é obrigatório.")]
        public Guid ItemId { get; set; }

        [DataType(DataType.Date, ErrorMessage = "A data de validade deve ser uma data válida.")]
        public DateTime? ExpirationDate { get; set; }
    }
}
