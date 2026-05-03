namespace APISolidarityManager.DTOs.Dashboard
{
    public class DashboardFamilyWaitListResponseDto
    {
        public Guid FamilyId { get; set; }
        public string FamilyName { get; set; } = null!;
        public DateTime? LastDeliveryDate { get; set; }
        public int DaysSinceLastDelivery { get; set; }
    }

    public class DashboardExpiringBatchResponseDto
    {
        public Guid BatchId { get; set; }
        public Guid ItemId { get; set; }
        public string ItemName { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime ExpirationDate { get; set; }
        public int DaysUntilExpiration { get; set; }
    }
}
