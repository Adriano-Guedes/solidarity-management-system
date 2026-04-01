using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Donations.Requests
{
    public class CreateDonationRequest
    {
        [Required(ErrorMessage = "A data de recebimento é obrigatória.")]
        public DateTime ReceivedDate { get; set; }

        [StringLength(1000, ErrorMessage = "As observações devem ter no máximo 1000 caracteres.")]
        public string? Notes { get; set; }

        [Required(ErrorMessage = "A doação deve conter ao menos um item.")]
        [MinLength(1, ErrorMessage = "A doação deve conter ao menos um item.")]
        public ICollection<DonationItemRequest> Items { get; set; } = new List<DonationItemRequest>();
    }
}
