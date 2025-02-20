using System.Text.Json.Serialization;
using DBContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Models;
using Newtonsoft.Json;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<ApiDbContext>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Disable cross-origin",
        policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

var app = builder.Build();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();

