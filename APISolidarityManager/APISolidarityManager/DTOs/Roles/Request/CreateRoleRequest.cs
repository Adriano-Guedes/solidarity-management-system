using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Roles.Request
{
    public class CreateRoleRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(30, ErrorMessage = "O nome não pode exceder 30 caracteres.")]
        public string Name { get; set; } = null!;
        [Required(ErrorMessage = "Descrição é obrigatória.")]
        [StringLength(500, ErrorMessage = "A descrição não pode exceder 500 caracteres.")]
        public string? Description { get; set; }
    }
}
