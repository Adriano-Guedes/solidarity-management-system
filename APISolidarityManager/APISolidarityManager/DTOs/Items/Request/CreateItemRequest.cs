using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Items.Request
{
    public class CreateItemRequest
    {
        [Required(ErrorMessage = "Doador é obrigatório.")]
        [StringLength(50, ErrorMessage = "O nome não pode exceder 50 caracteres.")]
        public string Name { get; set; } = null!;
        [Required(ErrorMessage = "Marca é obrigatória.")]
        [StringLength(20, ErrorMessage = "A marca não pode exceder 20 caracteres.")]
        public string Brand { get; set; } = null!;
        [StringLength(500, ErrorMessage = "A observação não pode exceder 500 caracteres.")]
        public string? Notes { get; set; }
        public bool Active { get; set; }
    }
}
