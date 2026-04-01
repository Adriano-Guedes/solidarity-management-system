using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.InventoryBatches
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class InventoryBatchesController : ControllerBase
    {
        public InventoryBatchesController()
        {
        }
    }
}
