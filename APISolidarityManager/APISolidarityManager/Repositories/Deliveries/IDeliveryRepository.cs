using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.Deliveries
{
    public interface IDeliveryRepository : IRepository<Delivery>
    {
        Task<IEnumerable<Delivery>> GetAllWithItemsAsync();
        Task<IEnumerable<Delivery>> GetAllByFamilyIdAsync(Guid familyId);
        Task<Delivery?> GetByIdWithItemsAsync(Guid id);
        Task<DateTime?> GetLastDeliveryDateByFamilyIdAsync(Guid familyId);
        Task<Dictionary<Guid, DateTime?>> GetLastDeliveryDatesByFamilyIdsAsync(IEnumerable<Guid> familyIds);
    }
}
