using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Donations
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DonationsController : ControllerBase
    {
        public DonationsController()
        {
        }
    }
}
