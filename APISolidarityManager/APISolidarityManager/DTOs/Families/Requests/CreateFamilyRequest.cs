using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Families.Requests
{
    public class CreateFamilyRequest
    {
        [Required(ErrorMessage = "O nome do responsável é obrigatório.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome do responsável deve ter entre 2 e 150 caracteres.")]
        public string ResponsibleName { get; set; } = null!;

        [StringLength(20, ErrorMessage = "O documento deve ter no máximo 20 caracteres.")]
        public string? ResponsibleDocument { get; set; }

        [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres.")]
        public string? PhoneNumber { get; set; }

        [StringLength(255, ErrorMessage = "O endereço deve ter no máximo 255 caracteres.")]
        public string? Address { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "A renda mensal não pode ser negativa.")]
        public decimal? MonthlyIncome { get; set; }

        [StringLength(1000, ErrorMessage = "As observações devem ter no máximo 1000 caracteres.")]
        public string? Notes { get; set; }
    }
}
