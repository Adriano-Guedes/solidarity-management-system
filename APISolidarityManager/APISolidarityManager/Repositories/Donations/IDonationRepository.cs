using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.Donations
{
    public interface IDonationRepository : IRepository<Donation>
    {
        Task<IEnumerable<Donation>> GetAllWithItemsAsync();
        Task<Donation?> GetByIdWithItemsAsync(Guid id);
    }
}
