using APISolidarityManager.Context;
using APISolidarityManager.Extensions;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddDatabase(builder.Configuration)
    .AddRepositories()
    .AddServices()
    .AddAutoMapperProfiles()
    .AddApiFilters()
    .AddCustomCors();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
if (app.Environment.IsDevelopment())
{
    app.ConfigureExceptionHandler();
}

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();