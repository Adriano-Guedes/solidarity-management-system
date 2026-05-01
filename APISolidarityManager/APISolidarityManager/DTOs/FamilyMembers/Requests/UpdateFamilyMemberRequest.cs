using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.FamilyMembers.Requests
{
    public class UpdateFamilyMemberRequest
    {
        [Required(ErrorMessage = "A família é obrigatória.")]
        public Guid FamilyId { get; set; }

        [Required(ErrorMessage = "O nome do membro é obrigatório.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 150 caracteres.")]
        public string Name { get; set; } = null!;

        [StringLength(20, ErrorMessage = "O documento deve ter no máximo 20 caracteres.")]
        public string? DocumentNumber { get; set; }

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        [DataType(DataType.Date, ErrorMessage = "A data de nascimento deve ser uma data válida.")]
        public DateTime? BirthDate { get; set; }

        [StringLength(30, ErrorMessage = "O gênero deve ter no máximo 30 caracteres.")]
        public string? Gender { get; set; }

        [StringLength(50, ErrorMessage = "O relacionamento deve ter no máximo 50 caracteres.")]
        public string? Relationship { get; set; }

        public bool HasDisability { get; set; }

        public bool HasChronicDisease { get; set; }

        public bool IsResponsible { get; set; }

        public bool Active { get; set; }
    }
}
