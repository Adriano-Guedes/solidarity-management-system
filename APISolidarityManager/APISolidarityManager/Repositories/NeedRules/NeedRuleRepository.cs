using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.NeedRules
{
    public class NeedRuleRepository : Repository<NeedRule>, INeedRuleRepository
    {
        public NeedRuleRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<NeedRule>> GetActiveRulesAsync()
        {
            return await _context.NeedRules
                .AsNoTracking()
                .Include(r => r.AgeRange)
                .Include(r => r.NeedGroup)
                .Where(r => r.AgeRange.Active && r.NeedGroup.Active)
                .ToListAsync();
        }
    }
}
