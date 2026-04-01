using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.Donations
{
    public class DonationRepository : Repository<Donation>, IDonationRepository
    {
        public DonationRepository(AppDbContext context) : base(context)
        {
        }
    }
}
