namespace APISolidarityManager.Models
{
    public class NeedGroup
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Active { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<NeedRule> NeedRules { get; set; } = new List<NeedRule>();
        public ICollection<ItemTemplate> ItemTemplates { get; set; } = new List<ItemTemplate>();
    }
}
