namespace APISolidarityManager.Models
{
    public class Item
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public Guid ItemTemplateId { get; set; }
        public string Name { get; set; } = null!;
        public string? Brand { get; set; }
        public decimal PackageQuantity { get; set; }
        public decimal TemplateWeight { get; set; }
        public string? UnitOfMeasure { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; } = true;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ItemCategory Category { get; set; } = null!;
        public ItemTemplate ItemTemplate { get; set; } = null!;

        public ICollection<InventoryBatch> InventoryBatches { get; set; } = new List<InventoryBatch>();
    }
}
