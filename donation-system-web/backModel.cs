public class CreateItemTemplateRequest
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
    public bool SuitableForAutoSuggestion { get; set; } = true;

    [Required]
    public bool RequiresManualAnalysis { get; set; }

    [StringLength(30)]
    public string? DefaultUnitOfMeasure { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }

    [Required]
    public bool Active { get; set; } = true;
}


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

    [StringLength(1000)]
    public string? Notes { get; set; }

    [Required]
    public bool Active { get; set; }
}


public class ItemTemplateResponse
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public Guid NeedGroupId { get; set; }
    public string NeedGroupName { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool IsPerishable { get; set; }
    public bool RequiresRefrigeration { get; set; }
    public bool SuitableForAutoSuggestion { get; set; }
    public bool RequiresManualAnalysis { get; set; }
    public string? DefaultUnitOfMeasure { get; set; }
    public decimal? ReferenceQuantity { get; set; }
    public string? Notes { get; set; }
    public bool Active { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}