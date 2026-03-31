using APISolidarityManager.Context;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Services.Items
{
    public class ItemService : IItemService
    {
        public readonly AppDbContext _context;

        public ItemService(AppDbContext context)
        {
            _context = context;
        }

    }
}
