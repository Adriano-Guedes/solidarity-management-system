using APISolidarityManager.Models;

namespace APISolidarityManager.DTOs.Users.Response
{
    public class UserResponse
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Role Role { get; set; } = null!;
    }
}
