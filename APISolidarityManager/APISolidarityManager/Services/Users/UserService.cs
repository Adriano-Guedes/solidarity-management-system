using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.Users;

namespace APISolidarityManager.Services.Users
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
    }
}
