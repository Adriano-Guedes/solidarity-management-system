using AutoMapper;

namespace APISolidarityManager.Extensions
{
    public static class AutoMapperCollectionExtension
    {
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            return services;
        }
    }
}