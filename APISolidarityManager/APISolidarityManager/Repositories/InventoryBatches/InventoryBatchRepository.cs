using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.InventoryBatches
{
    public class InventoryBatchRepository : Repository<InventoryBatch>, IInventoryBatchRepository
    {
        public InventoryBatchRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<InventoryBatch>> GetByItemIdAsync(Guid itemId)
        {
            return await _context.InventoryBatches
                .AsNoTracking()
                .Where(ib => ib.ItemId == itemId)
                .ToListAsync();
        }

        public async Task<InventoryBatch?> GetByItemIdAndExpirationDateAsync(Guid itemId, DateTime? expirationDate)
        {
            return await _context.InventoryBatches
                .FirstOrDefaultAsync(ib => ib.ItemId == itemId && ib.ExpirationDate == expirationDate);
        }

        public async Task<bool> HasMovementsAsync(Guid inventoryBatchId)
        {
            var hasDonationMovements = await _context.DonationInventoryItems
                .AnyAsync(dii => dii.InventoryBatchId == inventoryBatchId);

            if (hasDonationMovements)
                return true;

            var hasDeliveryMovements = await _context.DeliveryInventoryItems
                .AnyAsync(dii => dii.InventoryBatchId == inventoryBatchId);

            return hasDeliveryMovements;
        }

        public async Task<IEnumerable<InventoryBatch>> GetAvailableOrderedByExpirationAsync(Guid itemId)
        {
            return await _context.InventoryBatches
                .AsNoTracking()
                .Where(ib => ib.ItemId == itemId && ib.QuantityAvailable > 0)
                .OrderBy(ib => ib.ExpirationDate ?? DateTime.MaxValue)
                .ThenBy(ib => ib.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryBatch>> GetAvailableBatchesForSuggestionAsync()
        {
            return await _context.InventoryBatches
                .AsNoTracking()
                .Include(x => x.Item)
                    .ThenInclude(x => x.ItemTemplate)
                .Include(x => x.Item)
                    .ThenInclude(x => x.Category)
                .Where(x =>
                    x.QuantityAvailable > 0 &&
                    x.Item.Active &&
                    x.Item.ItemTemplate.Active &&
                    x.Item.ItemTemplate.SuitableForAutoSuggestion)
                .ToListAsync();
        }
    }
}
