using APISolidarityManager.DTOs.ItemTemplates.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.ItemTemplates;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.ItemTemplates
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class ItemTemplatesController : ControllerBase
    {
        private readonly IItemTemplateService _itemTemplateService;

        public ItemTemplatesController(IItemTemplateService itemTemplateService)
        {
            _itemTemplateService = itemTemplateService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var templates = await _itemTemplateService.GetAllAsync();
            return Ok(templates);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetAllActive()
        {
            var templates = await _itemTemplateService.GetAllActiveAsync();
            return Ok(templates);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var template = await _itemTemplateService.GetByIdAsync(id);
            return Ok(template);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateItemTemplateRequest request)
        {
            var createdTemplate = await _itemTemplateService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = createdTemplate.Id }, createdTemplate);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateItemTemplateRequest request)
        {
            var updatedTemplate = await _itemTemplateService.UpdateAsync(id, request);
            return Ok(updatedTemplate);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deletedTemplate = await _itemTemplateService.DeleteAsync(id);
            return Ok(deletedTemplate);
        }
    }
}
