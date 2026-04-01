using APISolidarityManager.Context;
using APISolidarityManager.Filters;
using APISolidarityManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Controllers.Items
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class ItemsController : ControllerBase
    {
        public ItemsController()
        {
        }
    }
}
