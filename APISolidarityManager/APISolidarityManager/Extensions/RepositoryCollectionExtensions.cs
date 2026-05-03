using APISolidarityManager.Repositories.AgeRanges;
using APISolidarityManager.Repositories.Base;
using APISolidarityManager.Repositories.Deliveries;
using APISolidarityManager.Repositories.DeliveryInventoryItems;
using APISolidarityManager.Repositories.DonationInventoryItems;
using APISolidarityManager.Repositories.Donations;
using APISolidarityManager.Repositories.Families;
using APISolidarityManager.Repositories.FamilyMembers;
using APISolidarityManager.Repositories.InventoryBatches;
using APISolidarityManager.Repositories.ItemCategories;
using APISolidarityManager.Repositories.Items;
using APISolidarityManager.Repositories.ItemTemplates;
using APISolidarityManager.Repositories.Logs;
using APISolidarityManager.Repositories.NeedGroups;
using APISolidarityManager.Repositories.NeedRules;
using APISolidarityManager.Repositories.UnitOfWork;
using APISolidarityManager.Repositories.Users;

namespace APISolidarityManager.Extensions
{
    public static class RepositoryCollectionExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            services.AddScoped<IDeliveryRepository, DeliveryRepository>();
            services.AddScoped<IDeliveryInventoryItemRepository, DeliveryInventoryItemRepository>();
            services.AddScoped<IDonationInventoryItemRepository, DonationInventoryItemRepository>();
            services.AddScoped<IDonationRepository, DonationRepository>();
            services.AddScoped<IFamilyRepository, FamilyRepository>();
            services.AddScoped<IFamilyMemberRepository, FamilyMemberRepository>();
            services.AddScoped<IInventoryBatchRepository, InventoryBatchRepository>();
            services.AddScoped<IItemCategoryRepository, ItemCategoryRepository>();
            services.AddScoped<IItemTemplateRepository, ItemTemplateRepository>();
            services.AddScoped<IItemRepository, ItemRepository>();
            services.AddScoped<INeedGroupRepository, NeedGroupRepository>();
            services.AddScoped<IAgeRangeRepository, AgeRangeRepository>();
            services.AddScoped<INeedRuleRepository, NeedRuleRepository>();
            services.AddScoped<ILogRepository, LogRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
