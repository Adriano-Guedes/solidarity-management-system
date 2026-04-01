using APISolidarityManager.Repositories.FamilyMembers;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Services.FamilyMembers
{
    public class FamilyMemberService : IFamilyMemberService
    {
        private readonly IFamilyMemberRepository _familyMemberRepository;

        public FamilyMemberService(IFamilyMemberRepository familyMemberRepository)
        {
            _familyMemberRepository = familyMemberRepository;
        }
    }
}
