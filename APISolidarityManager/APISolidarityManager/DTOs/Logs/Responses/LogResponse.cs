namespace APISolidarityManager.DTOs.Logs.Responses
{
    public class LogResponse
    {
        public Guid Id { get; set; }
        public Guid? UserId { get; set; }
        public string EntityName { get; set; } = null!;
        public Guid? EntityId { get; set; }
        public string Action { get; set; } = null!;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
