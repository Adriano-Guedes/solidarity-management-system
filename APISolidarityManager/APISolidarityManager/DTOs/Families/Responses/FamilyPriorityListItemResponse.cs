using APISolidarityManager.Common.Enums;

namespace APISolidarityManager.DTOs.Families.Responses
{
    public class FamilyPriorityListItemResponse
    {
        public Guid FamilyId { get; set; }
        public string ResponsibleName { get; set; } = null!;
        public int PriorityScore { get; set; }
        public string PriorityLevel { get; set; } = null!;
        public bool RequiresManualAnalysis { get; set; }
        public List<string> Reasons { get; set; } = new();
        public DateTime? LastDeliveryDate { get; set; }
    }
}
