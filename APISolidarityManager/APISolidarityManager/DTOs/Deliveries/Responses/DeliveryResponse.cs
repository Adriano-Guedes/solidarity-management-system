namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryResponse
    {
        public Guid Id { get; set; }
        public Guid FamilyId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<DeliveryItemResponse> Items { get; set; } = new List<DeliveryItemResponse>();
    }
}
