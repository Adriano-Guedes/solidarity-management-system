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

        public async Task<bool> ExistsByNameCategoryAndQuantityAsync(string name, Guid categoryId, decimal packageQuantity)
        {
            return await _context.Items
                .AsNoTracking()
                .AnyAsync(i => i.Name.ToLower() == name.ToLower() && 
                               i.CategoryId == categoryId && 
                               i.PackageQuantity == packageQuantity);
        }

        public async Task<Item?> GetByNameCategoryAndQuantityAsync(string name, Guid categoryId, decimal packageQuantity)
        {
            return await _context.Items
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Name.ToLower() == name.ToLower() && 
                                         i.CategoryId == categoryId && 
                                         i.PackageQuantity == packageQuantity);
        }

        public async Task<IEnumerable<Item>> GetAllWithTotalQuantityAsync()
        {
            return await _context.Items
                .AsNoTracking()
                .Include(i => i.Category)
                .Include(i => i.ItemTemplate)
                .Include(i => i.InventoryBatches)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetByCategoryWithTotalQuantityAsync(Guid categoryId)
        {
            return await _context.Items
                .AsNoTracking()
                .Include(i => i.Category)
                .Include(i => i.ItemTemplate)
                .Include(i => i.InventoryBatches)
                .Where(i => i.CategoryId == categoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Item>> GetAllActiveWithTotalQuantityAsync()
        {
            return await _context.Items
                .AsNoTracking()
                .Include(i => i.Category)
                .Include(i => i.ItemTemplate)
                    .ThenInclude(it => it.NeedGroup)
                .Include(i => i.InventoryBatches)
                .Where(i => i.Active)
                .ToListAsync();
        }
    }
}
