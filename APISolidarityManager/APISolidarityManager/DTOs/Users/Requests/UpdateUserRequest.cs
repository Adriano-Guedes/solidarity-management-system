using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.Users.Requests
{
    public class UpdateUserRequest
    {
        [Required(ErrorMessage = "O nome do usuário é obrigatório.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome do usuário deve ter entre 2 e 150 caracteres.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        [StringLength(150, ErrorMessage = "O e-mail deve ter no máximo 150 caracteres.")]
        public string Email { get; set; } = null!;

        public bool Active { get; set; }
    }
}
