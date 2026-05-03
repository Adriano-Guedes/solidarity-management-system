using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.AgeRanges
{
    public class AgeRangeRepository : Repository<AgeRange>, IAgeRangeRepository
    {
        public AgeRangeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsOverlapAsync(int minAge, int maxAge, Guid? excludeId = null)
        {
            var query = _context.AgeRanges.Where(x => x.Active);

            if (excludeId.HasValue)
            {
                query = query.Where(x => x.Id != excludeId.Value);
            }

            return await query.AnyAsync(x =>
                (minAge >= x.MinAge && minAge <= x.MaxAge) ||
                (maxAge >= x.MinAge && maxAge <= x.MaxAge) ||
                (minAge <= x.MinAge && maxAge >= x.MaxAge)
            );
        }
    }
}
