using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.Items
{
    public interface IItemRepository : IRepository<Item>
    {
        Task<Item?> GetByNameAndCategoryAsync(string name, Guid categoryId);
        Task<bool> ExistsByNameAndCategoryAsync(string name, Guid categoryId);
        Task<IEnumerable<Item>> GetAllActiveWithTotalQuantityAsync();
    }
}
