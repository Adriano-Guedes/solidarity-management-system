using APISolidarityManager.Filters;

namespace APISolidarityManager.Extensions
{
    public static class FilterExtensions
    {
        public static IServiceCollection AddApiFilters(this IServiceCollection services)
        {
            services.AddScoped<ActionExecutionLogFilter>();

            return services;
        }
    }
}