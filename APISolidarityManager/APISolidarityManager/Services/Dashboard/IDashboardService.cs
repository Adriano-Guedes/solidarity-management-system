using APISolidarityManager.DTOs.Dashboard;

namespace APISolidarityManager.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardSummaryResponseDto> GetSummaryAsync();
        Task<IEnumerable<DashboardEvolutionResponseDto>> GetEvolutionAsync();
        Task<IEnumerable<DashboardCategoryDistributionResponseDto>> GetCategoryDistributionAsync();
        Task<IEnumerable<DashboardFamilyWaitListResponseDto>> GetFamiliesInWaitListAsync();
        Task<IEnumerable<DashboardExpiringBatchResponseDto>> GetExpiringBatchesAsync();
    }
}
