using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.Donations
{
    public class DonationRepository : Repository<Donation>, IDonationRepository
    {
        public DonationRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Donation>> GetAllWithItemsAsync()
        {
            return await _context.Donations
                .Include(d => d.DonationInventoryItems)
                    .ThenInclude(di => di.InventoryBatch)
                .ToListAsync();
        }

        public async Task<Donation?> GetByIdWithItemsAsync(Guid id)
        {
            return await _context.Donations
                .Include(d => d.DonationInventoryItems)
                    .ThenInclude(di => di.InventoryBatch)
                .FirstOrDefaultAsync(d => d.Id == id);
        }
    }
}
