using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.ItemTemplates.Requests
{
    public class UpdateItemTemplateRequest
    {
        [Required(ErrorMessage = "A categoria é obrigatória.")]
        public Guid CategoryId { get; set; }

        [Required(ErrorMessage = "O grupo de necessidade é obrigatório.")]
        public Guid NeedGroupId { get; set; }

        [Required(ErrorMessage = "O nome do template é obrigatório.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 150 caracteres.")]
        public string Name { get; set; } = null!;

        [Required]
        public bool IsPerishable { get; set; }

        [Required]
        public bool RequiresRefrigeration { get; set; }

        [Required]
        public bool SuitableForAutoSuggestion { get; set; }

        [Required]
        public bool RequiresManualAnalysis { get; set; }

        [StringLength(30)]
        public string? DefaultUnitOfMeasure { get; set; }

        public decimal? ReferenceQuantity { get; set; } = 1;

        [StringLength(1000)]
        public string? Notes { get; set; }

        [Required]
        public bool Active { get; set; }
    }
}
