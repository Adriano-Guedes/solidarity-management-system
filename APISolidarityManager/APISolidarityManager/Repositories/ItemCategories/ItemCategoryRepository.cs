using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.ItemCategories
{
    public class ItemCategoryRepository : Repository<ItemCategory>, IItemCategoryRepository
    {
        public ItemCategoryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByNameAsync(string name)
        {
            return await _context.ItemCategories.AnyAsync(i => i.Name.ToLower() == name.ToLower());
        }
        public async Task<ItemCategory?> GetByNameAsync(string name)
        {
            return await _context.ItemCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Name.ToLower() == name.ToLower());
        }
    }
}
