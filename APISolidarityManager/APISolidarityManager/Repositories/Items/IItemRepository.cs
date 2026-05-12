using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.Items
{
    public interface IItemRepository : IRepository<Item>
    {
        Task<Item?> GetByNameCategoryAndQuantityAsync(string name, Guid categoryId, decimal packageQuantity);
        Task<bool> ExistsByNameCategoryAndQuantityAsync(string name, Guid categoryId, decimal packageQuantity);
        Task<IEnumerable<Item>> GetAllWithTotalQuantityAsync();
        Task<IEnumerable<Item>> GetByCategoryWithTotalQuantityAsync(Guid categoryId);
        Task<IEnumerable<Item>> GetAllActiveWithTotalQuantityAsync();
    }
}
