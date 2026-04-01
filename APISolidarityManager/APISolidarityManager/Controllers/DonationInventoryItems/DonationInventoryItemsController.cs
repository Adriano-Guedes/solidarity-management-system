using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.DonationInventoryItems
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DonationInventoryItemsController : ControllerBase
    {
            public DonationInventoryItemsController()
            {
        }
    }
}
