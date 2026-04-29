using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Items.Requests
{
    public class CreateItemRequest
    {
        [Required(ErrorMessage = "A categoria do item é obrigatória.")]
        public Guid CategoryId { get; set; }

        [Required(ErrorMessage = "O modelo base do item é obrigatório.")]
        public Guid ItemTemplateId { get; set; }

        [Required(ErrorMessage = "O nome do item é obrigatório.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 150 caracteres.")]
        public string Name { get; set; } = null!;

        [StringLength(100, ErrorMessage = "A marca deve ter no máximo 100 caracteres.")]
        public string? Brand { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero.")]
        public decimal PackageQuantity { get; set; }

        [StringLength(30, ErrorMessage = "A unidade de medida deve ter no máximo 30 caracteres.")]
        public string? UnitOfMeasure { get; set; }

        [StringLength(1000, ErrorMessage = "As observações devem ter no máximo 1000 caracteres.")]
        public string? Notes { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
