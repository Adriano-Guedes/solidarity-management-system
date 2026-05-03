public class DashboardSummaryResponseDto
{
    public int TotalActiveFamilies { get; set; }
    public int ActiveFamiliesServedThisMonth { get; set; }
    public int TotalPeopleImpactedThisMonth { get; set; }
    public int DeliveriesThisMonth { get; set; }
    public int DonationsThisMonth { get; set; }
}

public class DashboardEvolutionResponseDto
{
    public string Date { get; set; } = null!;
    public int Deliveries { get; set; }
    public int Donations { get; set; }
}

public class DashboardCategoryDistributionResponseDto
{
    public string Category { get; set; } = null!;
    public int Count { get; set; }
}

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
    public string ItemName { get; set; } = null!;
    public string CategoryName { get; set; } = null!;
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
    public int DaysUntilExpiration { get; set; }
}