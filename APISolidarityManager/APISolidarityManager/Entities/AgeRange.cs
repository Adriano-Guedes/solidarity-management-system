namespace APISolidarityManager.Models
{
    public class AgeRange
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public bool Active { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<NeedRule> NeedRules { get; set; } = new List<NeedRule>();
    }
}
