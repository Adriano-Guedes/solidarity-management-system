using APISolidarityManager.DTOs.NeedGroups.Requests;
using APISolidarityManager.DTOs.NeedGroups.Responses;

namespace APISolidarityManager.Services.NeedGroups
{
    public interface INeedGroupService
    {
        Task<IEnumerable<NeedGroupResponse>> GetAllAsync();
        Task<IEnumerable<NeedGroupResponse>> GetAllActiveAsync();
        Task<NeedGroupResponse> GetByIdAsync(Guid id);
        Task<NeedGroupResponse> CreateAsync(CreateNeedGroupRequest request);
        Task<NeedGroupResponse> UpdateAsync(Guid id, UpdateNeedGroupRequest request);
        Task<NeedGroupResponse> DeleteAsync(Guid id);
    }
}
