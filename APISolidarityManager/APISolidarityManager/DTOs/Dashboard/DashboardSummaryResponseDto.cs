namespace APISolidarityManager.DTOs.Dashboard
{
    public class DashboardSummaryResponseDto
    {
        public int TotalActiveFamilies { get; set; }
        public int ActiveFamiliesServedThisMonth { get; set; }
        public int TotalPeopleImpactedThisMonth { get; set; }
        public int DeliveriesThisMonth { get; set; }
        public int DonationsThisMonth { get; set; }
    }
}
