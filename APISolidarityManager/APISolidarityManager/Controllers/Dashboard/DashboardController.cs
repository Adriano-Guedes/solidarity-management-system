using APISolidarityManager.Filters;
using APISolidarityManager.Services.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Dashboard
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var summary = await _dashboardService.GetSummaryAsync();
            return Ok(summary);
        }

        [HttpGet("evolution")]
        public async Task<IActionResult> GetEvolution()
        {
            var evolution = await _dashboardService.GetEvolutionAsync();
            return Ok(evolution);
        }

        [HttpGet("distribution")]
        public async Task<IActionResult> GetDistribution()
        {
            var distribution = await _dashboardService.GetCategoryDistributionAsync();
            return Ok(distribution);
        }

        [HttpGet("wait-list")]
        public async Task<IActionResult> GetWaitList()
        {
            var waitList = await _dashboardService.GetFamiliesInWaitListAsync();
            return Ok(waitList);
        }

        [HttpGet("expiring-batches")]
        public async Task<IActionResult> GetExpiringBatches()
        {
            var expiringBatches = await _dashboardService.GetExpiringBatchesAsync();
            return Ok(expiringBatches);
        }
    }
}
