using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.Logs;

namespace APISolidarityManager.Services.Logs
{
    public class LogService : ILogService
    {
        private readonly ILogRepository _logRepository;

        public LogService(ILogRepository logRepository)
        {
            _logRepository = logRepository;
        }
    }
}
