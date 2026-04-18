using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.ItemTemplates
{
    public class ItemTemplateRepository : Repository<ItemTemplate>, IItemTemplateRepository
    {
        public ItemTemplateRepository(AppDbContext context) : base(context)
        {
        }
    }
}
