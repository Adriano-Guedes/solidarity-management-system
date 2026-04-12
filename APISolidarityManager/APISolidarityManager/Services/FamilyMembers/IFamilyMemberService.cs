using APISolidarityManager.DTOs.FamilyMembers.Requests;
using APISolidarityManager.DTOs.FamilyMembers.Responses;

namespace APISolidarityManager.Services.FamilyMembers
{
    public interface IFamilyMemberService
    {
        Task<IEnumerable<FamilyMemberResponse>> GetAllByFamilyIdAsync(Guid familyId);
        Task<FamilyMemberResponse> GetByIdAsync(Guid familyId, Guid memberId);
        Task<FamilyMemberResponse> CreateAsync(Guid familyId, CreateFamilyMemberRequest request);
        Task<FamilyMemberResponse> UpdateAsync(Guid familyId, Guid memberId, UpdateFamilyMemberRequest request);
        Task DeleteAsync(Guid familyId, Guid memberId);
    }
}
