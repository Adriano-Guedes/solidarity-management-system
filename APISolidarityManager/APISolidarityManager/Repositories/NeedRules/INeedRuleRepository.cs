using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.NeedRules
{
    public interface INeedRuleRepository : IRepository<NeedRule>
    {
        Task<IEnumerable<NeedRule>> GetActiveRulesAsync();
    }
}
