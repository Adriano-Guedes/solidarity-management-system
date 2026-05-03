using System.ComponentModel.DataAnnotations;

namespace APISolidarityManager.DTOs.NeedRules.Requests
{
    public class UpdateNeedRuleRequest
    {
        [Required(ErrorMessage = "A faixa etária é obrigatória.")]
        public Guid AgeRangeId { get; set; }

        [Required(ErrorMessage = "O grupo de necessidade é obrigatório.")]
        public Guid NeedGroupId { get; set; }

        [Required(ErrorMessage = "O valor da necessidade é obrigatório.")]
        [Range(0, double.MaxValue, ErrorMessage = "O valor deve ser maior ou igual a zero.")]
        public decimal Value { get; set; }
    }
}
