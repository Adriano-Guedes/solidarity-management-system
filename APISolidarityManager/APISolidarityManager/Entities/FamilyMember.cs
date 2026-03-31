namespace APISolidarityManager.Models
{
    public class FamilyMember
    {
        public Guid Id { get; set; }

        public Guid FamilyId { get; set; }

        public string Name { get; set; } = null!;

        public string? DocumentNumber { get; set; }

        public DateTime? BirthDate { get; set; }

        public string? Gender { get; set; }

        public string? Relationship { get; set; }

        public bool HasDisability { get; set; } = false;

        public bool HasChronicDisease { get; set; } = false;

        public bool IsResponsible { get; set; } = false;

        public bool Active { get; set; } = true;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Family Family { get; set; } = null!;
    }
}
