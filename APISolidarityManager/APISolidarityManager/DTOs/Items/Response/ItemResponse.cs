namespace APISolidarityManager.DTOs.Items.Response
{
    public class ItemResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public int TotalQuantity { get; set; }
        public string? Brand { get; set; }
        public string? Notes { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
