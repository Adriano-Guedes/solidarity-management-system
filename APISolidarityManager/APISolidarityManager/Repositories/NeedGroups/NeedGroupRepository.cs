using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.NeedGroups
{
    public class NeedGroupRepository : Repository<NeedGroup>, INeedGroupRepository
    {
        public NeedGroupRepository(AppDbContext context) : base(context)
        {
        }
    }
}
