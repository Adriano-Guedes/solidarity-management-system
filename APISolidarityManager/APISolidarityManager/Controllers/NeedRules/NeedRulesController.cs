using APISolidarityManager.DTOs.NeedRules.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.NeedRules;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.NeedRules
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class NeedRulesController : ControllerBase
    {
        private readonly INeedRuleService _needRuleService;

        public NeedRulesController(INeedRuleService needRuleService)
        {
            _needRuleService = needRuleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rules = await _needRuleService.GetAllAsync();
            return Ok(rules);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveRules()
        {
            var rules = await _needRuleService.GetActiveRulesAsync();
            return Ok(rules);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var rule = await _needRuleService.GetByIdAsync(id);
            return Ok(rule);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNeedRuleRequest request)
        {
            var createdRule = await _needRuleService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdRule.Id }, createdRule);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateNeedRuleRequest request)
        {
            var updatedRule = await _needRuleService.UpdateAsync(id, request);
            return Ok(updatedRule);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deletedRule = await _needRuleService.DeleteAsync(id);
            return Ok(deletedRule);
        }
    }
}
