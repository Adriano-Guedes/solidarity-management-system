using APISolidarityManager.DTOs.Donations.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.Donations;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.Donations
{
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class DonationsController : ControllerBase
    {
        private readonly IDonationService _donationService;

        public DonationsController(IDonationService donationService)
        {
            _donationService = donationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var donations = await _donationService.GetAllAsync();
            return Ok(donations);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var donation = await _donationService.GetByIdAsync(id);
            return Ok(donation);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDonationRequest request)
        {
            var createdBy = Guid.Parse("2F5B141E-907C-46E6-BEBD-33B28A73957D");

            var createdDonation = await _donationService.CreateAsync(request, createdBy);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdDonation.Id },
                createdDonation);
        }
    }
}
