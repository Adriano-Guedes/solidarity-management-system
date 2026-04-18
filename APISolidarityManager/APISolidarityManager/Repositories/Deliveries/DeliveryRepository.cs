using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.Deliveries
{
    public class DeliveryRepository : Repository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Delivery>> GetAllWithItemsAsync()
        {
            return await _context.Deliveries
                .Include(d => d.DeliveryInventoryItems)
                    .ThenInclude(di => di.InventoryBatch)
                .ToListAsync();
        }

        public async Task<Delivery?> GetByIdWithItemsAsync(Guid id)
        {
            return await _context.Deliveries
                .Include(d => d.DeliveryInventoryItems)
                    .ThenInclude(di => di.InventoryBatch)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<DateTime?> GetLastDeliveryDateByFamilyIdAsync(Guid familyId)
        {
            return await _context.Deliveries
                .Where(x => x.FamilyId == familyId)
                .OrderByDescending(x => x.DeliveryDate)
                .Select(x => (DateTime?)x.DeliveryDate)
                .FirstOrDefaultAsync();
        }
    }
}
