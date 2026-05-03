using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.ItemTemplates
{
    public interface IItemTemplateRepository : IRepository<ItemTemplate>
    {
        Task<IEnumerable<ItemTemplate>> GetAllWithDetailsAsync();
        Task<ItemTemplate?> GetByIdWithDetailsAsync(Guid id);
        Task<bool> ExistsByNameAndCategoryAsync(string name, Guid categoryId);
    }
}
