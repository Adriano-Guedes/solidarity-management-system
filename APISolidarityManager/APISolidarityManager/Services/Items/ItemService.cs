using APISolidarityManager.Context;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Services.Items
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

    }
}
