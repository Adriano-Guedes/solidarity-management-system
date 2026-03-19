using APISolidarityManager.Models;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryItem> DeliveryItems { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<DonationItem> DonationItems { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.PasswordHash)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasIndex(e => e.Email)
                    .IsUnique();

                entity.HasOne(e => e.Role)
                    .WithMany(r => r.Users)
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("Items");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.ToTable("Inventories");

                entity.HasKey(e => e.ItemId);

                entity.Property(e => e.QuantityAvailable)
                    .IsRequired();

                entity.HasOne(e => e.Item)
                    .WithOne(i => i.Inventory)
                    .HasForeignKey<Inventory>(e => e.ItemId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Donor>(entity =>
            {
                entity.ToTable("Donors");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(50);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(20);

                entity.Property(e => e.Email)
                    .HasMaxLength(150);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();
            });

            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("Donations");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.ReceivedDate)
                    .IsRequired();

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasOne(e => e.Donor)
                    .WithMany(d => d.Donations)
                    .HasForeignKey(e => e.DonorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.DonationsCreated)
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DonationItem>(entity =>
            {
                entity.ToTable("DonationItems");

                entity.HasKey(e => new { e.DonationId, e.ItemId });

                entity.Property(e => e.Quantity)
                    .IsRequired();

                entity.HasOne(e => e.Donation)
                    .WithMany(d => d.DonationItems)
                    .HasForeignKey(e => e.DonationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Item)
                    .WithMany(i => i.DonationItems)
                    .HasForeignKey(e => e.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Beneficiary>(entity =>
            {
                entity.ToTable("Beneficiaries");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.DocumentNumber)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.BirthDate)
                    .IsRequired();

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(20);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();
            });

            modelBuilder.Entity<Delivery>(entity =>
            {
                entity.ToTable("Deliveries");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.DeliveryDate)
                    .IsRequired();

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasOne(e => e.Beneficiary)
                    .WithMany(b => b.Deliveries)
                    .HasForeignKey(e => e.BeneficiaryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany(u => u.DeliveriesCreated)
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DeliveryItem>(entity =>
            {
                entity.ToTable("DeliveryItems");

                entity.HasKey(e => new { e.DeliveryId, e.ItemId });

                entity.Property(e => e.Quantity)
                    .IsRequired();

                entity.HasOne(e => e.Delivery)
                    .WithMany(d => d.DeliveryItems)
                    .HasForeignKey(e => e.DeliveryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Item)
                    .WithMany(i => i.DeliveryItems)
                    .HasForeignKey(e => e.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
