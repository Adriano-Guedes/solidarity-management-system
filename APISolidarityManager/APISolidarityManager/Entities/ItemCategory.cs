namespace APISolidarityManager.Models
{
    public class ItemCategory
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool Active { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<Item> Items { get; set; } = new List<Item>();
        public ICollection<ItemTemplate> ItemTemplates { get; set; } = new List<ItemTemplate>();
    }
}
