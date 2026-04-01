using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.DeliveryInventoryItems
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DeliveryInventoryItemsController : ControllerBase
    {
        public DeliveryInventoryItemsController()
        {
        }
    }
}
