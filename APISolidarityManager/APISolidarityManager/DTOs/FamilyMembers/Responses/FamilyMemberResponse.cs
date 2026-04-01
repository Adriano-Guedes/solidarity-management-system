namespace APISolidarityManager.DTOs.FamilyMembers.Responses
{
    public class FamilyMemberResponse
    {
        public Guid Id { get; set; }
        public Guid FamilyId { get; set; }
        public string Name { get; set; } = null!;
        public string? DocumentNumber { get; set; }
        public DateTime? BirthDate { get; set; }
        public string? Gender { get; set; }
        public string? Relationship { get; set; }
        public bool HasDisability { get; set; }
        public bool HasChronicDisease { get; set; }
        public bool IsResponsible { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
