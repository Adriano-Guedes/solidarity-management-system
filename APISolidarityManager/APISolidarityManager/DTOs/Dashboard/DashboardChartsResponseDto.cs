namespace APISolidarityManager.DTOs.Dashboard
{
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
}
