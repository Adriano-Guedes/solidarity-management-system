using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.AgeRanges
{
    public interface IAgeRangeRepository : IRepository<AgeRange>
    {
        Task<bool> ExistsOverlapAsync(int minAge, int maxAge, Guid? excludeId = null);
    }
}
