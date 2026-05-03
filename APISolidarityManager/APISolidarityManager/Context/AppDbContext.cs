using APISolidarityManager.Models;
using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Family> Families { get; set; }
        public DbSet<FamilyMember> FamilyMembers { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemTemplate> ItemTemplates { get; set; }
        public DbSet<NeedGroup> NeedGroups { get; set; }
        public DbSet<AgeRange> AgeRanges { get; set; }
        public DbSet<NeedRule> NeedRules { get; set; }
        public DbSet<InventoryBatch> InventoryBatches { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<DonationInventoryItem> DonationInventoryItems { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<DeliveryInventoryItem> DeliveryInventoryItems { get; set; }
        public DbSet<Log> Logs { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureUsers(modelBuilder);
            ConfigureFamilies(modelBuilder);
            ConfigureFamilyMembers(modelBuilder);
            ConfigureItemCategories(modelBuilder);
            ConfigureNeedGroups(modelBuilder);
            ConfigureAgeRanges(modelBuilder);
            ConfigureNeedRules(modelBuilder);
            ConfigureItemTemplates(modelBuilder);
            ConfigureItems(modelBuilder);
            ConfigureInventoryBatches(modelBuilder);
            ConfigureDonations(modelBuilder);
            ConfigureDonationInventoryItems(modelBuilder);
            ConfigureDeliveries(modelBuilder);
            ConfigureDeliveryInventoryItems(modelBuilder);
            ConfigureLogs(modelBuilder);
        }

        private static void ConfigureUsers(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Email)
                    .HasColumnName("email")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.HasIndex(x => x.Email)
                    .IsUnique();

                entity.Property(x => x.PasswordHash)
                    .HasColumnName("password_hash")
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });
        }

        private static void ConfigureFamilies(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Family>(entity =>
            {
                entity.ToTable("families");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.ResponsibleName)
                    .HasColumnName("responsible_name")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.ResponsibleDocument)
                    .HasColumnName("responsible_document")
                    .HasMaxLength(20);

                entity.HasIndex(x => x.ResponsibleDocument)
                    .IsUnique()
                    .HasFilter("[responsible_document] IS NOT NULL");

                entity.Property(x => x.PhoneNumber)
                    .HasColumnName("phone_number")
                    .HasMaxLength(20);

                entity.Property(x => x.Address)
                    .HasColumnName("address")
                    .HasMaxLength(255);

                entity.Property(x => x.MonthlyIncome)
                    .HasColumnName("monthly_income")
                    .HasPrecision(18, 2);

                entity.Property(x => x.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(1000);

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasMany(x => x.FamilyMembers)
                    .WithOne(x => x.Family)
                    .HasForeignKey(x => x.FamilyId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(x => x.Deliveries)
                    .WithOne(x => x.Family)
                    .HasForeignKey(x => x.FamilyId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureFamilyMembers(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FamilyMember>(entity =>
            {
                entity.ToTable("family_members");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.FamilyId)
                    .HasColumnName("family_id")
                    .IsRequired();

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.DocumentNumber)
                    .HasColumnName("document_number")
                    .HasMaxLength(20);

                entity.Property(x => x.BirthDate)
                    .HasColumnName("birth_date");

                entity.Property(x => x.Gender)
                    .HasColumnName("gender")
                    .HasMaxLength(30);

                entity.Property(x => x.Relationship)
                    .HasColumnName("relationship")
                    .HasMaxLength(50);

                entity.Property(x => x.HasDisability)
                    .HasColumnName("has_disability")
                    .HasDefaultValue(false)
                    .IsRequired();

                entity.Property(x => x.HasChronicDisease)
                    .HasColumnName("has_chronic_disease")
                    .HasDefaultValue(false)
                    .IsRequired();

                entity.Property(x => x.IsResponsible)
                    .HasColumnName("is_responsible")
                    .HasDefaultValue(false)
                    .IsRequired();

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });
        }

        private static void ConfigureItemCategories(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ItemCategory>(entity =>
            {
                entity.ToTable("items_categories");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.HasIndex(x => x.Name)
                    .IsUnique();

                entity.Property(x => x.Description)
                    .HasColumnName("description")
                    .HasMaxLength(500);

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasMany(x => x.Items)
                    .WithOne(x => x.Category)
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureNeedGroups(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NeedGroup>(entity =>
            {
                entity.ToTable("need_groups");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.HasIndex(x => x.Name)
                    .IsUnique();

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });
        }

        private static void ConfigureAgeRanges(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AgeRange>(entity =>
            {
                entity.ToTable("age_ranges");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.MinAge)
                    .HasColumnName("min_age")
                    .IsRequired();

                entity.Property(x => x.MaxAge)
                    .HasColumnName("max_age")
                    .IsRequired();

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });
        }

        private static void ConfigureNeedRules(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NeedRule>(entity =>
            {
                entity.ToTable("need_rules");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.AgeRangeId)
                    .HasColumnName("age_range_id")
                    .IsRequired();

                entity.Property(x => x.NeedGroupId)
                    .HasColumnName("need_group_id")
                    .IsRequired();

                entity.Property(x => x.Value)
                    .HasColumnName("value")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasOne(x => x.AgeRange)
                    .WithMany(x => x.NeedRules)
                    .HasForeignKey(x => x.AgeRangeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.NeedGroup)
                    .WithMany(x => x.NeedRules)
                    .HasForeignKey(x => x.NeedGroupId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private static void ConfigureItems(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("items");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.CategoryId)
                    .HasColumnName("category_id")
                    .IsRequired();

                entity.Property(x => x.ItemTemplateId)
                    .HasColumnName("item_template_id")
                    .IsRequired();

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.Brand)
                    .HasColumnName("brand")
                    .HasMaxLength(100);

                entity.Property(x => x.PackageQuantity)
                    .HasColumnName("package_quantity")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(x => x.TemplateWeight)
                    .HasColumnName("template_weight")
                    .HasColumnType("decimal(18,2)")
                    .IsRequired();

                entity.Property(x => x.UnitOfMeasure)
                    .HasColumnName("unit_of_measure")
                    .HasMaxLength(30);

                entity.Property(x => x.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(1000);

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasIndex(x => new { x.CategoryId, x.Name, x.PackageQuantity, x.UnitOfMeasure })
                    .IsUnique();

                entity.HasOne(x => x.Category)
                    .WithMany(x => x.Items)
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(x => x.ItemTemplateId);

                entity.HasOne(x => x.ItemTemplate)
                    .WithMany(x => x.Items)
                    .HasForeignKey(x => x.ItemTemplateId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(x => x.InventoryBatches)
                    .WithOne(x => x.Item)
                    .HasForeignKey(x => x.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureItemTemplates(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ItemTemplate>(entity =>
            {
                entity.ToTable("item_templates");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.CategoryId)
                    .HasColumnName("category_id")
                    .IsRequired();

                entity.Property(x => x.NeedGroupId)
                    .HasColumnName("need_group_id")
                    .IsRequired();

                entity.Property(x => x.Name)
                    .HasColumnName("name")
                    .HasMaxLength(150)
                    .IsRequired();

                entity.Property(x => x.IsPerishable)
                    .HasColumnName("is_perishable")
                    .IsRequired();

                entity.Property(x => x.RequiresRefrigeration)
                    .HasColumnName("requires_refrigeration")
                    .IsRequired();

                entity.Property(x => x.SuitableForAutoSuggestion)
                    .HasColumnName("suitable_for_auto_suggestion")
                    .IsRequired();

                entity.Property(x => x.RequiresManualAnalysis)
                    .HasColumnName("requires_manual_analysis")
                    .IsRequired();

                entity.Property(x => x.DefaultUnitOfMeasure)
                    .HasColumnName("default_unit_of_measure")
                    .HasMaxLength(30);

                entity.Property(x => x.ReferenceQuantity)
                    .HasColumnName("reference_quantity")
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(1000);

                entity.Property(x => x.Active)
                    .HasColumnName("active")
                    .HasDefaultValue(true)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasIndex(x => new { x.CategoryId, x.Name })
                    .IsUnique();

                entity.HasOne(x => x.Category)
                    .WithMany(x => x.ItemTemplates)
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.NeedGroup)
                    .WithMany(x => x.ItemTemplates)
                    .HasForeignKey(x => x.NeedGroupId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(x => x.Items)
                    .WithOne(x => x.ItemTemplate)
                    .HasForeignKey(x => x.ItemTemplateId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureInventoryBatches(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InventoryBatch>(entity =>
            {
                entity.ToTable("inventory_batches");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.ItemId)
                    .HasColumnName("item_id")
                    .IsRequired();

                entity.Property(x => x.ExpirationDate)
                    .HasColumnName("expiration_date");

                entity.Property(x => x.QuantityAvailable)
                    .HasColumnName("quantity_available")
                    .HasDefaultValue(0)
                    .IsRequired();

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");
            });
        }

        private static void ConfigureDonations(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Donation>(entity =>
            {
                entity.ToTable("donations");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.ReceivedDate)
                    .HasColumnName("received_date")
                    .IsRequired();

                entity.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .IsRequired();

                entity.Property(x => x.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(1000);

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasOne(x => x.CreatedByUser)
                    .WithMany(x => x.DonationsCreated)
                    .HasForeignKey(x => x.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(x => x.DonationInventoryItems)
                    .WithOne(x => x.Donation)
                    .HasForeignKey(x => x.DonationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private static void ConfigureDonationInventoryItems(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DonationInventoryItem>(entity =>
            {
                entity.ToTable("donation_inventory_items");

                entity.HasKey(x => new { x.DonationId, x.InventoryBatchId });

                entity.Property(x => x.DonationId)
                    .HasColumnName("donation_id");

                entity.Property(x => x.InventoryBatchId)
                    .HasColumnName("inventory_batch_id");

                entity.Property(x => x.Quantity)
                    .HasColumnName("quantity")
                    .IsRequired();

                entity.HasOne(x => x.InventoryBatch)
                    .WithMany(x => x.DonationInventoryItems)
                    .HasForeignKey(x => x.InventoryBatchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureDeliveries(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Delivery>(entity =>
            {
                entity.ToTable("deliveries");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.FamilyId)
                    .HasColumnName("family_id")
                    .IsRequired();

                entity.Property(x => x.DeliveryDate)
                    .HasColumnName("delivery_date")
                    .IsRequired();

                entity.Property(x => x.CreatedBy)
                    .HasColumnName("created_by")
                    .IsRequired();

                entity.Property(x => x.Notes)
                    .HasColumnName("notes")
                    .HasMaxLength(1000);

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.Property(x => x.UpdatedAt)
                    .HasColumnName("updated_at");

                entity.HasOne(x => x.CreatedByUser)
                    .WithMany(x => x.DeliveriesCreated)
                    .HasForeignKey(x => x.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(x => x.DeliveryInventoryItems)
                    .WithOne(x => x.Delivery)
                    .HasForeignKey(x => x.DeliveryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private static void ConfigureDeliveryInventoryItems(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeliveryInventoryItem>(entity =>
            {
                entity.ToTable("delivery_inventory_items");

                entity.HasKey(x => new { x.DeliveryId, x.InventoryBatchId });

                entity.Property(x => x.DeliveryId)
                    .HasColumnName("delivery_id");

                entity.Property(x => x.InventoryBatchId)
                    .HasColumnName("inventory_batch_id");

                entity.Property(x => x.Quantity)
                    .HasColumnName("quantity")
                    .IsRequired();

                entity.HasOne(x => x.InventoryBatch)
                    .WithMany(x => x.DeliveryInventoryItems)
                    .HasForeignKey(x => x.InventoryBatchId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private static void ConfigureLogs(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Log>(entity =>
            {
                entity.ToTable("logs");

                entity.HasKey(x => x.Id);

                entity.Property(x => x.Id)
                    .HasColumnName("id");

                entity.Property(x => x.UserId)
                    .HasColumnName("user_id");

                entity.Property(x => x.EntityName)
                    .HasColumnName("entity_name")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(x => x.EntityId)
                    .HasColumnName("entity_id");

                entity.Property(x => x.Action)
                    .HasColumnName("action")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(x => x.OldValues)
                    .HasColumnName("old_values")
                    .HasColumnType("nvarchar(max)");

                entity.Property(x => x.NewValues)
                    .HasColumnName("new_values")
                    .HasColumnType("nvarchar(max)");

                entity.Property(x => x.Description)
                    .HasColumnName("description")
                    .HasMaxLength(1000);

                entity.Property(x => x.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired();

                entity.HasOne(x => x.User)
                    .WithMany(x => x.Logs)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }
    }
}
