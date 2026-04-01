using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.ItemCategories.Requests
{
    public class UpdateItemCategoryRequest
    {
        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome da categoria deve ter entre 2 e 100 caracteres.")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string? Description { get; set; }

        public bool Active { get; set; }
    }
}
