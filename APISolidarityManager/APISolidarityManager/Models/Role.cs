namespace APISolidarityManager.Models
{
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
