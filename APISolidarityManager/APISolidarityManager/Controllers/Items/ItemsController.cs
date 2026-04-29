using APISolidarityManager.Context;
using APISolidarityManager.DTOs.Items.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Models;
using APISolidarityManager.Services.Items;
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
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _itemService.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("category/{categoryId:guid}")]
        public async Task<IActionResult> GetAllByCategory(Guid categoryId)
        {
            var items = await _itemService.GetAllByCategoryAsync(categoryId);
            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var item = await _itemService.GetByIdAsync(id);
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateItemRequest request)
        {
            var createdItem = await _itemService.CreateAsync(request);

            return CreatedAtAction(nameof(GetById), new { id = createdItem.Id }, createdItem);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateItemRequest request)
        {
            var updatedItem = await _itemService.UpdateAsync(id, request);
            return Ok(updatedItem);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var updatedItem = await _itemService.DeleteAsync(id);
            return Ok(updatedItem);
        }
    }
}
