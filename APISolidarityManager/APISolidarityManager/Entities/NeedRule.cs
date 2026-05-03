namespace APISolidarityManager.Models
{
    public class NeedRule
    {
        public Guid Id { get; set; }
        public Guid AgeRangeId { get; set; }
        public Guid NeedGroupId { get; set; }
        public decimal Value { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public AgeRange AgeRange { get; set; } = null!;
        public NeedGroup NeedGroup { get; set; } = null!;
    }
}
