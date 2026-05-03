using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.ItemTemplates
{
    public class ItemTemplateRepository : Repository<ItemTemplate>, IItemTemplateRepository
    {
        public ItemTemplateRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ItemTemplate>> GetAllWithDetailsAsync()
        {
            return await _context.ItemTemplates
                .AsNoTracking()
                .Include(it => it.Category)
                .Include(it => it.NeedGroup)
                .OrderBy(it => it.Name)
                .ToListAsync();
        }

        public async Task<ItemTemplate?> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.ItemTemplates
                .AsNoTracking()
                .Include(it => it.Category)
                .Include(it => it.NeedGroup)
                .FirstOrDefaultAsync(it => it.Id == id);
        }

        public async Task<bool> ExistsByNameAndCategoryAsync(string name, Guid categoryId)
        {
            return await _context.ItemTemplates
                .AsNoTracking()
                .AnyAsync(it => it.Name.ToLower() == name.ToLower() && it.CategoryId == categoryId);
        }
    }
}
