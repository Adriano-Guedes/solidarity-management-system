using APISolidarityManager.Common.Enums;

namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliverySuggestionResponse
    {
        public Guid FamilyId { get; set; }
        public string ResponsibleName { get; set; } = null!;
        public int PriorityScore { get; set; }
        public string PriorityLevel { get; set; } = null!;
        public bool RequiresManualAnalysis { get; set; }
        public List<string> Reasons { get; set; } = new();
        public List<DeliverySuggestionItemResponse> SuggestedItems { get; set; } = new();
        public List<DeliverySuggestionNeedGroupResponse> NeedGroupsSummary { get; set; } = new();
    }
}
