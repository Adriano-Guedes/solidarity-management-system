using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.Families
{
    public class FamilyRepository : Repository<Family>, IFamilyRepository
    {
        public FamilyRepository(AppDbContext context) : base(context)
        {
        }
    }
}
