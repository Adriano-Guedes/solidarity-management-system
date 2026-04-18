using APISolidarityManager.DTOs.Families.Responses;

namespace APISolidarityManager.Services.Families.FamilyPriority
{
    public interface IFamilyPriorityService
    {
        Task<FamilyPriorityResponse> GetFamilyPriorityAsync(Guid familyId);
    }
}
