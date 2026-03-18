using APISolidarityManager.Models;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Context
{
    public class APISolidarityManagerContext : DbContext
    {
        public APISolidarityManagerContext(DbContextOptions<APISolidarityManagerContext> options) : base(options)
        {
        }

        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryItem> DeliveryItems { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<DonationItem> DonationItems { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<Inventory> Inventory { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
