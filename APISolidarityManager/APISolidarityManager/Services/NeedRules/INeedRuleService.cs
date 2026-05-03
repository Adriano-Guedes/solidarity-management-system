using APISolidarityManager.DTOs.NeedRules.Requests;
using APISolidarityManager.DTOs.NeedRules.Responses;

namespace APISolidarityManager.Services.NeedRules
{
    public interface INeedRuleService
    {
        Task<IEnumerable<NeedRuleResponse>> GetAllAsync();
        Task<IEnumerable<NeedRuleResponse>> GetActiveRulesAsync();
        Task<NeedRuleResponse> GetByIdAsync(Guid id);
        Task<NeedRuleResponse> CreateAsync(CreateNeedRuleRequest request);
        Task<NeedRuleResponse> UpdateAsync(Guid id, UpdateNeedRuleRequest request);
        Task<NeedRuleResponse> DeleteAsync(Guid id);
    }
}
