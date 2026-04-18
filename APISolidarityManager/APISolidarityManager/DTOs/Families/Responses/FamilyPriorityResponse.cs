namespace APISolidarityManager.DTOs.Families.Responses
{
    public class FamilyPriorityResponse
    {
        public Guid FamilyId { get; set; }
        public int PriorityScore { get; set; }
        public string PriorityLevel { get; set; } = null!;
        public bool RequiresManualAnalysis { get; set; }
        public List<string> Reasons { get; set; } = new();
    }
}
