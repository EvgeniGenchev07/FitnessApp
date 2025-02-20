using DBContexts;
using Models;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<UserContext>();
builder.Services.AddScoped<ExerciseContext>();
builder.Services.AddScoped<WorkoutContext>();
builder.Services.AddScoped<WorkoutExerciseContext>();
builder.Services.AddScoped<SetContext>();
builder.Services.AddScoped<ScheduleContext>();
builder.Services.AddScoped<MealContext>();
builder.Services.AddScoped<FoodContext>();
builder.Services.AddScoped<MeasurementContext>();
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

