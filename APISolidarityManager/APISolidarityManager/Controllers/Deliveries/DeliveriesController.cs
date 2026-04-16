using APISolidarityManager.DTOs.Deliveries.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.Deliveries;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Deliveries
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DeliveriesController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveriesController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var deliveries = await _deliveryService.GetAllAsync();
            return Ok(deliveries);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var delivery = await _deliveryService.GetByIdAsync(id);
            return Ok(delivery);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDeliveryRequest request)
        {
            // Temporário até autenticação
            var createdBy = Guid.Parse("2F5B141E-907C-46E6-BEBD-33B28A73957D");

            var createdDelivery = await _deliveryService.CreateAsync(request, createdBy);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdDelivery.Id },
                createdDelivery);
        }
    }
}
