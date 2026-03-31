using APISolidarityManager.Services.Beneficiaries;
using APISolidarityManager.Services.Deliveries;
using APISolidarityManager.Services.DeliveryInventoryItems;
using APISolidarityManager.Services.DonationInventoryItems;
using APISolidarityManager.Services.Donations;
using APISolidarityManager.Services.Donors;
using APISolidarityManager.Services.InventoryBatches;
using APISolidarityManager.Services.Items;
using APISolidarityManager.Services.Roles;
using APISolidarityManager.Services.Users;

namespace APISolidarityManager.Extentions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IBeneficiaryService, BeneficiaryService>();
            services.AddScoped<IDeliveryService, DeliveryService>();
            services.AddScoped<IDeliveryInventoryItemService, DeliveryInventoryItemService>();
            services.AddScoped<IDonationInventoryItemService, DonationInventoryItemService>();
            services.AddScoped<IDonationService, DonationService>();
            services.AddScoped<IDonorService, DonorService>();
            services.AddScoped<IInventoryBatchService, InventoryBatchService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUserService, UserService>();

            return services;
        }
    }
}
