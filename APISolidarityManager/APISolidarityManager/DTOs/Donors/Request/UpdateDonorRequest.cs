using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Donors.Request
{
    public class UpdateDonorRequest
    {
        [Required(ErrorMessage = "Doador é obrigatório.")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = null!;
        [StringLength(30, ErrorMessage = "O número do documento não pode exceder 30 caracteres.")]
        public string? DocumentNumber { get; set; }
        [StringLength(20, ErrorMessage = "O número de telefone não pode exceder 20 caracteres.")]
        public string? PhoneNumber { get; set; }
        [StringLength(50, ErrorMessage = "O email não pode exceder 50 caracteres.")]
        public string? Email { get; set; }
        [StringLength(500, ErrorMessage = "As notas não podem exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public bool Active { get; set; }
    }
}
