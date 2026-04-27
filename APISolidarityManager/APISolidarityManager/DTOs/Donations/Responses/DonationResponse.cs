namespace APISolidarityManager.DTOs.Donations.Responses
{
    public class DonationResponse
    {
        public Guid Id { get; set; }
        public DateTime ReceivedDate { get; set; }
        public Guid CreatedBy { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<DonationItemResponse> Items { get; set; } = new List<DonationItemResponse>();
    }
}
