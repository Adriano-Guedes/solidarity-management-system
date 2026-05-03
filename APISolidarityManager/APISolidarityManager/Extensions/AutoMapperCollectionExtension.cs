using AutoMapper;

namespace APISolidarityManager.Extensions
{
    public static class AutoMapperCollectionExtension
    {
        public static IServiceCollection AddAutoMapperProfiles(this IServiceCollection services)
        {
            services.AddSingleton(sp =>
            {
                var loggerFactory = sp.GetRequiredService<ILoggerFactory>();

                var mapperConfig = new MapperConfiguration(cfg =>
                {
                    cfg.AddMaps(typeof(AutoMapperCollectionExtension).Assembly);
                }, loggerFactory);

                return mapperConfig;
            });

            services.AddSingleton<IMapper>(sp =>
            {
                var config = sp.GetRequiredService<MapperConfiguration>();
                return config.CreateMapper();
            });

            return services;
        }
    }
}