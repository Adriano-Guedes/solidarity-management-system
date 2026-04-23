using APISolidarityManager.DTOs.Families.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.Deliveries.DeliverySuggestions;
using APISolidarityManager.Services.Families;
using APISolidarityManager.Services.Families.FamilyPriority;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Families
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class FamiliesController : ControllerBase
    {
        private readonly IFamilyService _familyService;
        private readonly IFamilyPriorityService _familyPriorityService;
        private readonly IDeliverySuggestionService _deliverySuggestionService;

        public FamiliesController(
            IFamilyService familyService,
            IFamilyPriorityService familyPriorityService,
            IDeliverySuggestionService deliverySuggestionService)
        {
            _familyService = familyService;
            _familyPriorityService = familyPriorityService;
            _deliverySuggestionService = deliverySuggestionService;
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

        [HttpGet("{id}/priority")]
        public async Task<IActionResult> GetPriority(Guid id)
        {
            var response = await _familyPriorityService.GetFamilyPriorityAsync(id);
            return Ok(response);
        }

        [HttpGet("priority-ranking")]
        public async Task<IActionResult> GetPriorityRanking()
        {
            var response = await _familyPriorityService.GetPriorityRankingAsync();
            return Ok(response);
        }

        [HttpGet("{id}/delivery-suggestion")]
        public async Task<IActionResult> GetDeliverySuggestion(Guid id)
        {
            var response = await _deliverySuggestionService.GetDeliverySuggestionAsync(id);
            return Ok(response);
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
