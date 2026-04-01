using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Logs
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class LogsController : ControllerBase
    {
        public LogsController()
        {
        }
    }
}
