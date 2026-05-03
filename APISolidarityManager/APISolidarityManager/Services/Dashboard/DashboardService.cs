using APISolidarityManager.Context;
using APISolidarityManager.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryResponseDto> GetSummaryAsync()
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var totalActiveFamilies = await _context.Families
                .CountAsync(f => f.Active);

            var familiesServedThisMonthQuery = _context.Families
                .Where(f => f.Active && f.Deliveries.Any(d => d.DeliveryDate >= startOfMonth));

            var activeFamiliesServedThisMonth = await familiesServedThisMonthQuery.CountAsync();

            var totalPeopleImpactedThisMonth = await _context.FamilyMembers
                .Where(m => m.Active && m.Family.Active && m.Family.Deliveries.Any(d => d.DeliveryDate >= startOfMonth))
                .CountAsync();

            var deliveriesThisMonth = await _context.Deliveries
                .CountAsync(d => d.DeliveryDate >= startOfMonth);

            var donationsThisMonth = await _context.Donations
                .CountAsync(d => d.ReceivedDate >= startOfMonth);

            return new DashboardSummaryResponseDto
            {
                TotalActiveFamilies = totalActiveFamilies,
                ActiveFamiliesServedThisMonth = activeFamiliesServedThisMonth,
                TotalPeopleImpactedThisMonth = totalPeopleImpactedThisMonth,
                DeliveriesThisMonth = deliveriesThisMonth,
                DonationsThisMonth = donationsThisMonth
            };
        }

        public async Task<IEnumerable<DashboardEvolutionResponseDto>> GetEvolutionAsync()
        {
            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-29);

            var deliveries = await _context.Deliveries
                .Where(d => d.DeliveryDate >= startDate && d.DeliveryDate <= endDate.AddDays(1))
                .GroupBy(d => d.DeliveryDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            var donations = await _context.Donations
                .Where(d => d.ReceivedDate >= startDate && d.ReceivedDate <= endDate.AddDays(1))
                .GroupBy(d => d.ReceivedDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .ToListAsync();

            var evolution = new List<DashboardEvolutionResponseDto>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                evolution.Add(new DashboardEvolutionResponseDto
                {
                    Date = date.ToString("dd/MM"),
                    Deliveries = deliveries.FirstOrDefault(d => d.Date == date)?.Count ?? 0,
                    Donations = donations.FirstOrDefault(d => d.Date == date)?.Count ?? 0
                });
            }

            return evolution;
        }

        public async Task<IEnumerable<DashboardCategoryDistributionResponseDto>> GetCategoryDistributionAsync()
        {
            var distribution = await _context.DeliveryInventoryItems
                .GroupBy(di => di.InventoryBatch.Item.Category.Name)
                .Select(g => new DashboardCategoryDistributionResponseDto
                {
                    Category = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(d => d.Count)
                .ToListAsync();

            return distribution;
        }

        public async Task<IEnumerable<DashboardFamilyWaitListResponseDto>> GetFamiliesInWaitListAsync()
        {
            var thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-30);

            var families = await _context.Families
                .Where(f => f.Active)
                .Select(f => new
                {
                    f.Id,
                    f.ResponsibleName,
                    LastDelivery = f.Deliveries.OrderByDescending(d => d.DeliveryDate).FirstOrDefault()
                })
                .Where(f => f.LastDelivery == null || f.LastDelivery.DeliveryDate < thirtyDaysAgo)
                .OrderBy(f => f.LastDelivery == null ? DateTime.MinValue : f.LastDelivery.DeliveryDate)
                .ToListAsync();

            return families.Select(f => new DashboardFamilyWaitListResponseDto
            {
                FamilyId = f.Id,
                FamilyName = f.ResponsibleName,
                LastDeliveryDate = f.LastDelivery?.DeliveryDate,
                DaysSinceLastDelivery = f.LastDelivery == null ? 999 : (int)(DateTime.UtcNow - f.LastDelivery.DeliveryDate).TotalDays
            });
        }

        public async Task<IEnumerable<DashboardExpiringBatchResponseDto>> GetExpiringBatchesAsync()
        {
            var today = DateTime.UtcNow.Date;
            var fifteenDaysFromNow = today.AddDays(15);

            var batches = await _context.InventoryBatches
                .Where(b => b.QuantityAvailable > 0 && 
                            b.ExpirationDate.HasValue && 
                            b.ExpirationDate.Value >= today && 
                            b.ExpirationDate.Value <= fifteenDaysFromNow)
                .OrderBy(b => b.ExpirationDate)
                .Select(b => new DashboardExpiringBatchResponseDto
                {
                    BatchId = b.Id,
                    ItemId = b.ItemId,
                    ItemName = b.Item.Name,
                    CategoryName = b.Item.Category.Name,
                    Quantity = b.QuantityAvailable,
                    ExpirationDate = b.ExpirationDate!.Value,
                    DaysUntilExpiration = (int)(b.ExpirationDate.Value - today).TotalDays
                })
                .ToListAsync();

            return batches;
        }
    }
}
