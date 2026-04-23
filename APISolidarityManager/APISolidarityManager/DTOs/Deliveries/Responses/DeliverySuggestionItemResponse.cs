namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliverySuggestionItemResponse
    {
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = null!;
        public string NeedGroup { get; set; } = null!;
        public decimal PackageQuantity { get; set; }
        public string? UnitOfMeasure { get; set; }
        public int SuggestedUnits { get; set; }
        public decimal TotalSuggestedQuantity { get; set; }
        public string Justification { get; set; } = null!;
    }
}
