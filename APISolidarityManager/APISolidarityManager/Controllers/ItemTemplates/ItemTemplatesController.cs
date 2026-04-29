using APISolidarityManager.Filters;
using APISolidarityManager.Services.ItemCategories;
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var template = await _itemTemplateService.GetByIdAsync(id);
            return Ok(template);
        }
    }
}
