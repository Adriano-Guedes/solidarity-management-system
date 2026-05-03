namespace APISolidarityManager.Models
{
    public class ItemTemplate
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid NeedGroupId { get; set; }
        public string Name { get; set; } = null!;
        public bool IsPerishable { get; set; }
        public bool RequiresRefrigeration { get; set; }
        public bool SuitableForAutoSuggestion { get; set; }
        public bool RequiresManualAnalysis { get; set; }
        public string? DefaultUnitOfMeasure { get; set; }
        public decimal? ReferenceQuantity { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ItemCategory Category { get; set; } = null!;
        public NeedGroup NeedGroup { get; set; } = null!;

        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}