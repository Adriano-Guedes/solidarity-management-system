using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Deliveries
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DeliveriesController : ControllerBase
    {
        public DeliveriesController()
        {
        }
    }
}
