using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Donations.Requests
{
    public class DonationItemRequest
    {
        [Required(ErrorMessage = "O item é obrigatório.")]
        public Guid ItemId { get; set; }

        [DataType(DataType.Date, ErrorMessage = "A data de validade deve ser uma data válida.")]
        public DateTime? ExpirationDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public int Quantity { get; set; }
    }
}
