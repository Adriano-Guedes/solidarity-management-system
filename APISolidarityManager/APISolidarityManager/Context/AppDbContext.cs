using APISolidarityManager.Models;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<InventoryBatch> InventoryBatches { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<DonationInventoryItem> DonationInventoryItems { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryInventoryItem> DeliveryInventoryItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("roles");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasIndex(e => e.Name)
                    .IsUnique();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50);

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
                    .WithMany()
                    .HasForeignKey(e => e.RoleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Beneficiary>(entity =>
            {
                entity.ToTable("beneficiaries");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.DocumentNumber)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

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

                entity.HasIndex(e => e.DocumentNumber)
                    .IsUnique();
            });

            modelBuilder.Entity<Donor>(entity =>
            {
                entity.ToTable("donors");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.DocumentNumber)
                    .HasMaxLength(30);

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(20);

                entity.Property(e => e.Email)
                    .HasMaxLength(50);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasIndex(e => e.DocumentNumber)
                    .IsUnique();
            });

            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("items");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Brand)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.Active)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasIndex(e => new { e.Name, e.Brand })
                    .IsUnique();
            });

            modelBuilder.Entity<InventoryBatch>(entity =>
            {
                entity.ToTable("inventory_batches");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.ItemId)
                    .IsRequired();

                entity.Property(e => e.Tag)
                    .HasMaxLength(20);

                entity.Property(e => e.ExpirationDate);

                entity.Property(e => e.QuantityAvailable)
                    .IsRequired();

                entity.Property(e => e.UpdatedAt);

                entity.HasOne(e => e.Item)
                    .WithMany()
                    .HasForeignKey(e => e.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.Tag)
                    .IsUnique();
            });

            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("donations");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.ReceivedDate)
                    .IsRequired();

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasOne(e => e.Donor)
                    .WithMany()
                    .HasForeignKey(e => e.DonorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DonationInventoryItem>(entity =>
            {
                entity.ToTable("donation_inventory_items");

                entity.HasKey(e => new { e.DonationId, e.InventoryBatchId });

                entity.Property(e => e.Quantity)
                    .IsRequired();

                entity.HasOne<Donation>()
                    .WithMany()
                    .HasForeignKey(e => e.DonationId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.InventoryBatch)
                    .WithMany()
                    .HasForeignKey(e => e.InventoryBatchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Delivery>(entity =>
            {
                entity.ToTable("deliveries");

                entity.HasKey(e => e.Id);

                entity.Property(e => e.DeliveryDate)
                    .IsRequired();

                entity.Property(e => e.Notes)
                    .HasMaxLength(500);

                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                entity.HasOne(e => e.Beneficiary)
                    .WithMany()
                    .HasForeignKey(e => e.BeneficiaryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<DeliveryInventoryItem>(entity =>
            {
                entity.ToTable("delivery_inventory_items");

                entity.HasKey(e => new { e.DeliveryId, e.InventoryBatchId });

                entity.Property(e => e.Quantity)
                    .IsRequired();

                entity.HasOne<Delivery>()
                    .WithMany()
                    .HasForeignKey(e => e.DeliveryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.InventoryBatch)
                    .WithMany()
                    .HasForeignKey(e => e.InventoryBatchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
