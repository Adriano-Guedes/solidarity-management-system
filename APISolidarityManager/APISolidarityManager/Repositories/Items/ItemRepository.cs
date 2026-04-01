using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Families;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.Items
{
    public class ItemRepository : Repository<Item>, IItemRepository
    {
        public ItemRepository(AppDbContext context) : base(context)
        {
        }
    }
}
