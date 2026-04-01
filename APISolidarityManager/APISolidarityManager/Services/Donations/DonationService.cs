using APISolidarityManager.Repositories.Donations;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.Donations
{
    public class DonationService : IDonationService
    {
        private readonly IDonationRepository _donationRepository;

        public DonationService(IDonationRepository donationRepository)
        {
            _donationRepository = donationRepository;
        }
    }
}
