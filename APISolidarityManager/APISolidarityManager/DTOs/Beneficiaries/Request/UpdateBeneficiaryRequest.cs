using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Beneficiaries.Request
{
    public class UpdateBeneficiaryRequest
    {
        [Required(ErrorMessage = "Id é obrigatório.")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Documento é obrigatório.")]
        [StringLength(30, ErrorMessage = "O número do documento não pode exceder 30 caracteres.")]
        public string DocumentNumber { get; set; } = null!;
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = null!;
        [Required(ErrorMessage = "Data de nascimento é obrigatória.")]
        public DateTime BirthDate { get; set; }
        [StringLength(20, ErrorMessage = "O número de telefone não pode exceder 20 caracteres.")]
        public string? PhoneNumber { get; set; }
        [StringLength(500, ErrorMessage = "A observação não pode exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public bool Active { get; set; }
    }
}
