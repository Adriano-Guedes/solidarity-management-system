using APISolidarityManager.DTOs.FamilyMembers.Requests;
using APISolidarityManager.Filters;
using APISolidarityManager.Services.FamilyMembers;
using Microsoft.AspNetCore.Mvc;

namespace APISolidarityManager.Controllers.FamilyMembers
{
    [ApiController]
    [Route("api/families/{familyId:guid}/members")]
    [ServiceFilter(typeof(ActionExecutionLogFilter))]
    public class FamilyMembersController : ControllerBase
    {
        private readonly IFamilyMemberService _familyMemberService;

        public FamilyMembersController(IFamilyMemberService familyMemberService)
        {
            _familyMemberService = familyMemberService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllByFamilyId(Guid familyId)
        {
            var familyMembers = await _familyMemberService.GetAllByFamilyIdAsync(familyId);
            return Ok(familyMembers);
        }

        [HttpGet("{memberId:guid}")]
        public async Task<IActionResult> GetById(Guid familyId, Guid memberId)
        {
            var familyMember = await _familyMemberService.GetByIdAsync(familyId, memberId);
            return Ok(familyMember);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Guid familyId, [FromBody] CreateFamilyMemberRequest request)
        {
            var createdFamilyMember = await _familyMemberService.CreateAsync(familyId, request);

            return CreatedAtAction(
                nameof(GetById),
                new { familyId = familyId, memberId = createdFamilyMember.Id },
                createdFamilyMember);
        }

        [HttpPut("{memberId:guid}")]
        public async Task<IActionResult> Update(Guid familyId, Guid memberId, [FromBody] UpdateFamilyMemberRequest request)
        {
            var updatedFamilyMember = await _familyMemberService.UpdateAsync(familyId, memberId, request);
            return Ok(updatedFamilyMember);
        }

        [HttpPut("{memberId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid familyId, Guid memberId)
        {
            var updatedFamilyMember = await _familyMemberService.UpdateStatusAsync(familyId, memberId);
            return Ok(updatedFamilyMember);
        }

        [HttpDelete("{memberId:guid}")]
        public async Task<IActionResult> Delete(Guid familyId, Guid memberId)
        {
            await _familyMemberService.DeleteAsync(familyId, memberId);
            return NoContent();
        }
    }
}
