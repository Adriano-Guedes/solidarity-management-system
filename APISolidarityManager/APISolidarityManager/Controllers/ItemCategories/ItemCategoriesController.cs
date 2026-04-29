using APISolidarityManager.DTOs.ItemCategories.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.ItemCategories;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.ItemCategories
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class ItemCategoriesController : ControllerBase
    {
        private readonly IItemCategoryService _itemCategoryService;

        public ItemCategoriesController(IItemCategoryService itemCategoryService)
        {
            _itemCategoryService = itemCategoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _itemCategoryService.GetAllAsync();
            return Ok(categories);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await _itemCategoryService.GetByIdAsync(id);
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateItemCategoryRequest request)
        {
            var createdCategory = await _itemCategoryService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdCategory.Id },
                createdCategory);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateItemCategoryRequest request)
        {
            var updatedCategory = await _itemCategoryService.UpdateAsync(id, request);
            return Ok(updatedCategory);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var updatedCategory = await _itemCategoryService.DeleteAsync(id);
            return Ok(updatedCategory);
        }
    }
}
