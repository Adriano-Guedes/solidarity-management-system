using APISolidarityManager.Filters;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.FamilyMembers
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class FamilyMembersController : ControllerBase
    {
        public FamilyMembersController()
        {
        }
    }
}
