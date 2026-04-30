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

        public async Task<bool> ExistsByNameAndCategoryAsync(string name, Guid categoryId)
        {
            return await _context.Items.AnyAsync(i => i.Name.ToLower() == name.ToLower() && i.CategoryId == categoryId);
        }

        public async Task<Item?> GetByNameAndCategoryAsync(string name, Guid categoryId)
        {
            return await _context.Items
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Name.ToLower() == name.ToLower() && i.CategoryId == categoryId);
        }
    }
}
