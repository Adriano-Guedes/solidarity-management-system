using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Users.Request
{
    public class CreateUserRequest
    {
        [Required(ErrorMessage = "Função é obrigatória.")]
        public Guid RoleId { get; set; }
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome não pode exceder 100 caracteres.")]
        public string Name { get; set; } = null!;
        [Required(ErrorMessage = "Email é obrigatório.")]
        [StringLength(50, ErrorMessage = "O email não pode exceder 50 caracteres.")]
        public string Email { get; set; } = null!;
        public bool Active { get; set; }
    }
}