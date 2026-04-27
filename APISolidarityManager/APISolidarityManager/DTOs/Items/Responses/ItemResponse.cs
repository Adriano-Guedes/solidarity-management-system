namespace APISolidarityManager.DTOs.Items.Responses
{
    public class ItemResponse
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public Guid ItemTemplateId { get; set; }
        public string ItemTemplateName { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Brand { get; set; }
        public decimal PackageQuantity { get; set; }
        public string? UnitOfMeasure { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
