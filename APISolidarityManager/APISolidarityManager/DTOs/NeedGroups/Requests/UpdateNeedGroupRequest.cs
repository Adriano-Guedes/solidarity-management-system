using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.NeedGroups.Requests
{
    public class UpdateNeedGroupRequest
    {
        [Required(ErrorMessage = "O nome do grupo de necessidade é obrigatório.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 100 caracteres.")]
        public string Name { get; set; } = null!;

        [Required]
        public bool Active { get; set; }
    }
}
