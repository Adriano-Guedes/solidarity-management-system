using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Repositories.Families
{
    public class FamilyRepository : Repository<Family>, IFamilyRepository
    {
        public FamilyRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByResponsibleDocumentAsync(string document)
        {
            return await _context.Families
                .AnyAsync(f => f.ResponsibleDocument == document);
        }

        public async Task<Family?> GetByResponsibleDocumentAsync(string document)
        {
            return await _context.Families
                .FirstOrDefaultAsync(f => f.ResponsibleDocument == document);
        }

        public async Task<Family?> GetByIdWithMembersAsync(Guid familyId)
        {
            return await _context.Families
                .Include(x => x.FamilyMembers)
                .FirstOrDefaultAsync(x => x.Id == familyId);
        }

        public async Task<IEnumerable<Family>> GetAllActiveWithMembersAsync()
        {
            return await _context.Families
                .Include(x => x.FamilyMembers)
                .Where(x => x.Active)
                .ToListAsync();
        }
    }
}
