using APISolidarityManager.Context;
using APISolidarityManager.Models;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Items;

namespace APISolidarityManager.Repositories.Logs
{
    public class LogRepository : Repository<Log>, ILogRepository
    {
        public LogRepository(AppDbContext context) : base(context)
        {
        }
    }
}
