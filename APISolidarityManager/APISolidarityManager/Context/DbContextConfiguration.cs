using Microsoft.EntityFrameworkCore;

namespace APISolidarityManager.Context
{
    public static class DbContextConfiguration
    {
        public static IServiceCollection AddDatabase(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var provider = configuration["DatabaseProvider"];

            services.AddDbContext<AppDbContext>(options =>
            {
                if (provider == "SqlServer")
                {
                    options.UseSqlServer(
                        configuration.GetConnectionString("SqlServerConnection"));
                }
                else
                {
                    var connectionString = configuration.GetConnectionString("MySqlConnection");

                    options.UseMySql(
                        connectionString,
                        ServerVersion.AutoDetect(connectionString));
                }
            });

            return services;
        }
    }
}
