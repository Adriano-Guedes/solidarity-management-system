using APISolidarityManager.DTOs.NeedGroups.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.NeedGroups;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.NeedGroups
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class NeedGroupsController : ControllerBase
    {
        private readonly INeedGroupService _needGroupService;

        public NeedGroupsController(INeedGroupService needGroupService)
        {
            _needGroupService = needGroupService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var groups = await _needGroupService.GetAllAsync();
            return Ok(groups);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var groups = await _needGroupService.GetAllActiveAsync();
            return Ok(groups);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var group = await _needGroupService.GetByIdAsync(id);
            return Ok(group);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNeedGroupRequest request)
        {
            var createdGroup = await _needGroupService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdGroup.Id }, createdGroup);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateNeedGroupRequest request)
        {
            var updatedGroup = await _needGroupService.UpdateAsync(id, request);
            return Ok(updatedGroup);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var updatedGroup = await _needGroupService.DeleteAsync(id);
            return Ok(updatedGroup);
        }
    }
}
