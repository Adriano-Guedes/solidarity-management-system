using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.ItemCategories
{
    public class ItemCategoryService : IItemCategoryService
    {
        private readonly IItemCategoryRepository _itemCategoryRepository;

        public ItemCategoryService(IItemCategoryRepository itemCategoryRepository)
        {
            _itemCategoryRepository = itemCategoryRepository;
        }
    }
}
