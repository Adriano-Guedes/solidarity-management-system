namespace APISolidarityManager.DTOs.Deliveries.Responses
{
    public class DeliveryResponse
    {
        public Guid Id { get; set; }
        public Guid FamilyId { get; set; }
        public string FamilyResponsibleName { get; set; } = string.Empty;
        public DateTime DeliveryDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ICollection<DeliveryItemResponse> Items { get; set; } = new List<DeliveryItemResponse>();
    }
}
