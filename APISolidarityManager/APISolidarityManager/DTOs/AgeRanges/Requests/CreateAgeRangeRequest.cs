using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.AgeRanges.Requests
{
    public class CreateAgeRangeRequest
    {
        [Required(ErrorMessage = "O nome da faixa etária é obrigatório.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 100 caracteres.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "A idade mínima é obrigatória.")]
        [Range(0, 150, ErrorMessage = "A idade mínima deve estar entre 0 e 150.")]
        public int MinAge { get; set; }

        [Required(ErrorMessage = "A idade máxima é obrigatória.")]
        [Range(0, 150, ErrorMessage = "A idade máxima deve estar entre 0 e 150.")]
        public int MaxAge { get; set; }

        [Required]
        public bool Active { get; set; } = true;
    }
}
