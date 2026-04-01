namespace APISolidarityManager.DTOs.Donations.Responses
{
    public class DonationItemResponse
    {
        public Guid InventoryBatchId { get; set; }
        public Guid ItemId { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public int Quantity { get; set; }
    }
}
