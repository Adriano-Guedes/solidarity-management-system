namespace APISolidarityManager.DTOs.Items.Responses
{
    public class ActiveItemResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public decimal PackageQuantity { get; set; }
        public decimal TemplateWeight { get; set; }
        public string? UnitOfMeasure { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Guid ItemTemplateId { get; set; }
        public string ItemTemplateName { get; set; } = string.Empty;
        public string NeedGroup { get; set; } = string.Empty;
        public decimal ReferenceQuantity { get; set; }
        public int TotalQuantity { get; set; }
    }
}
