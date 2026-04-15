using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.ItemCategories
{
    public interface IItemCategoryRepository : IRepository<ItemCategory>
    {
        Task<bool> ExistsByNameAsync(string name);
        Task<ItemCategory?> GetByNameAsync(string name);
    }
}
