using APISolidarityManager.Services;
using APISolidarityManager.Services.AgeRanges;
using APISolidarityManager.Services.Deliveries;
using APISolidarityManager.Services.Deliveries.DeliverySuggestions;
using APISolidarityManager.Services.DeliveryInventoryItems;
using APISolidarityManager.Services.DonationInventoryItems;
using APISolidarityManager.Services.Donations;
using APISolidarityManager.Services.Families;
using APISolidarityManager.Services.Families.FamilyPriority;
using APISolidarityManager.Services.FamilyMembers;
using APISolidarityManager.Services.InventoryBatches;
using APISolidarityManager.Services.ItemCategories;
using APISolidarityManager.Services.Items;
using APISolidarityManager.Services.ItemTemplates;
using APISolidarityManager.Services.Logs;
using APISolidarityManager.Services.NeedGroups;
using APISolidarityManager.Services.NeedRules;
using APISolidarityManager.Services.Users;

namespace APISolidarityManager.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IDeliveryService, DeliveryService>();
            services.AddScoped<IDeliveryInventoryItemService, DeliveryInventoryItemService>();
            services.AddScoped<IDeliverySuggestionService, DeliverySuggestionService>();
            services.AddScoped<IDonationInventoryItemService, DonationInventoryItemService>();
            services.AddScoped<IDonationService, DonationService>();
            services.AddScoped<IFamilyService, FamilyService>();
            services.AddScoped<IFamilyMemberService, FamilyMemberService>();
            services.AddScoped<IFamilyPriorityService, FamilyPriorityService>();
            services.AddScoped<IInventoryBatchService, InventoryBatchService>();
            services.AddScoped<IItemCategoryService, ItemCategoryService>();
            services.AddScoped<IItemTemplateService, ItemTemplateService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<INeedGroupService, NeedGroupService>();
            services.AddScoped<IAgeRangeService, AgeRangeService>();
            services.AddScoped<INeedRuleService, NeedRuleService>();
            services.AddScoped<ILogService, LogService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
