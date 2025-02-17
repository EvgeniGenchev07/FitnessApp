using System.Text.Json.Serialization;
using DBContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Models;
using Newtonsoft.Json;

var builder = WebApplication.CreateSlimBuilder(args);
builder.Services.AddControllers();
builder.Services.AddScoped<ApiDbContext>();

var app = builder.Build();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();



//var userMap = app.MapGroup("/user");
//userMap.MapGet("/neshto", () => db.Users.First());
//userMap.MapGet("/nestho/{id}", (int id) =>
    /*db.Users.FirstOrDefault(a => a.Id == id) is { } user
        ? Results.Ok(user)
        : Results.NotFound()); */
//userMap.MapPost("/post/{data}", (string data) =>
    //db.AddUser(JsonConvert.DeserializeObject<User>(data)).Exception == null? Results.BadRequest(): Results.Ok());


app.Run();

