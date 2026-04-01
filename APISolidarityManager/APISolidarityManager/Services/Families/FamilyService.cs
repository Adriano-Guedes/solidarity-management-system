using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.Families
{
    public class FamilyService : IFamilyService
    {
        private readonly IFamilyRepository _familyRepository;

        public FamilyService(IFamilyRepository familyRepository)
        {
            _familyRepository = familyRepository;
        }
    }
}
