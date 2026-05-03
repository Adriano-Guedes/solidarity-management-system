namespace APISolidarityManager.DTOs.NeedRules.Responses
{
    public class NeedRuleResponse
    {
        public Guid Id { get; set; }
        public Guid AgeRangeId { get; set; }
        public string AgeRangeName { get; set; } = null!;
        public Guid NeedGroupId { get; set; }
        public string NeedGroupName { get; set; } = null!;
        public decimal Value { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
