using APISolidarityManager.DTOs.Families.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.Families;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Families
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class FamiliesController : ControllerBase
    {
        private readonly IFamilyService _familyService;

        public FamiliesController(IFamilyService familyService)
        {
            _familyService = familyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var families = await _familyService.GetAllAsync();
            return Ok(families);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var family = await _familyService.GetByIdAsync(id);
            return Ok(family);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFamilyRequest request)
        {
            var createdFamily = await _familyService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdFamily.Id },
                createdFamily);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateFamilyRequest request)
        {
            var updatedFamily = await _familyService.UpdateAsync(id, request);
            return Ok(updatedFamily);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _familyService.DeleteAsync(id);
            return NoContent();
        }
    }
}
