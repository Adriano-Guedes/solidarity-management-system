using APISolidarityManager.DTOs.AgeRanges.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.AgeRanges;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.AgeRanges
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class AgeRangesController : ControllerBase
    {
        private readonly IAgeRangeService _ageRangeService;

        public AgeRangesController(IAgeRangeService ageRangeService)
        {
            _ageRangeService = ageRangeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ranges = await _ageRangeService.GetAllAsync();
            return Ok(ranges);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var ranges = await _ageRangeService.GetAllActiveAsync();
            return Ok(ranges);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var range = await _ageRangeService.GetByIdAsync(id);
            return Ok(range);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAgeRangeRequest request)
        {
            var createdRange = await _ageRangeService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdRange.Id }, createdRange);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAgeRangeRequest request)
        {
            var updatedRange = await _ageRangeService.UpdateAsync(id, request);
            return Ok(updatedRange);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var updatedRange = await _ageRangeService.DeleteAsync(id);
            return Ok(updatedRange);
        }
    }
}
