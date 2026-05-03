using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.AgeRanges
{
    public class AgeRangeRepository : Repository<AgeRange>, IAgeRangeRepository
    {
        public AgeRangeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
