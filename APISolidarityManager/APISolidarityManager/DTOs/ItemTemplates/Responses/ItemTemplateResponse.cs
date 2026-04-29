namespace APISolidarityManager.DTOs.ItemTemplates.Responses
{
    public class ItemTemplateResponse
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string NeedGroup { get; set; } = null!;
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
    }
}
