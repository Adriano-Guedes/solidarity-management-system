namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliverySuggestionNeedGroupResponse
    {
        public string NeedGroup { get; set; } = null!;
        public decimal RequiredQuantity { get; set; }
        public decimal SuggestedQuantity { get; set; }
        public decimal MissingQuantity { get; set; }
        public bool FullyMet { get; set; }
    }
}
