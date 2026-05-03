namespace APISolidarityManager.DTOs.AgeRanges.Responses
{
    public class AgeRangeResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
