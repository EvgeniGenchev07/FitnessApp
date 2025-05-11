using DBContexts;
using Microsoft.EntityFrameworkCore;
using System.Net.Sockets;
using System.Net;

var builder = WebApplication.CreateSlimBuilder(args);
builder.Services.AddControllers();

builder.Configuration
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AthloboostDbContext>(options=>options.UseSqlite(connectionString));
builder.Services.AddScoped<UserContext>();
builder.Services.AddScoped<UserLogin>();
builder.Services.AddScoped<ExerciseContext>();
builder.Services.AddScoped<WorkoutContext>();
builder.Services.AddScoped<SetContext>();
builder.Services.AddScoped<ScheduleContext>();
builder.Services.AddScoped<FoodContext>();
builder.Services.AddScoped<MeasurementContext>();
builder.Services.AddScoped<PostContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Disable cross-origin",
        policy =>
        {

            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();
app.UseRouting();;
app.UseAuthorization();
app.MapControllers();
app.UseCors("Disable cross-origin");
app.Run();

