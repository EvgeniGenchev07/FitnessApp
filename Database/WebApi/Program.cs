using DBContexts;

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

