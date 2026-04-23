using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;

namespace APISolidarityManager.Repositories.Families
{
    public interface IFamilyRepository : IRepository<Family>
    {
        Task<bool> ExistsByResponsibleDocumentAsync(string document);
        Task<Family?> GetByResponsibleDocumentAsync(string document);
        Task<Family?> GetByIdWithMembersAsync(Guid familyId);
        Task<IEnumerable<Family>> GetAllActiveWithMembersAsync();
    }
}
