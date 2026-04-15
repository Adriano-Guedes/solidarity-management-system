using APISolidarityManager.DTOs.InventoryBatches.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.InventoryBatches;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.InventoryBatches
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class InventoryBatchesController : ControllerBase
    {
        private readonly IInventoryBatchService _inventoryBatchService;

        public InventoryBatchesController(
            IInventoryBatchService inventoryBatchService)
        {
            _inventoryBatchService = inventoryBatchService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventoryBatches = await _inventoryBatchService.GetAllAsync();
            return Ok(inventoryBatches);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var inventoryBatch = await _inventoryBatchService.GetByIdAsync(id);
            return Ok(inventoryBatch);
        }

        [HttpGet("item/{itemId:guid}")]
        public async Task<IActionResult> GetByItemId(Guid itemId)
        {
            var inventoryBatches = await _inventoryBatchService.GetByItemIdAsync(itemId);
            return Ok(inventoryBatches);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInventoryBatchRequest request)
        {
            var updatedInventoryBatch = await _inventoryBatchService.UpdateAsync(id, request);
            return Ok(updatedInventoryBatch);
        }
    }
}
