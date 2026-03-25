using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Items.Request
{
    public class UpdateItemRequest
    {
        [Required(ErrorMessage = "Item é obrigatório.")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome não pode exceder 50 caracteres.")]
        public string Name { get; set; } = null!;
        [StringLength(20, ErrorMessage = "A marca não pode exceder 20 caracteres.")]
        public string? Brand { get; set; }
        [StringLength(500, ErrorMessage = "As notas não podem exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public bool Active { get; set; }
    }
}
