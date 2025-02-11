using System.Text.Json.Serialization;
using DBContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Models;

var builder = WebApplication.CreateSlimBuilder(args);

var app = builder.Build();

var db = new UserDBContext();
db.Database.EnsureCreated();
db.Database.OpenConnection();
db.Add(new User()
{
    UserName = "newUser",
    Password = "password123",
    Email = "newuser@example.com",
    Age = 25,
    Height = 180
});

var todo = app.MapGroup("/user");
todo.MapGet("/", () => db.User.First());
todo.MapGet("/{id}", (int id) =>
    db.User.FirstOrDefault(a => a.Id == id) is { } user
        ? Results.Ok(user)
        : Results.NotFound());
db.Database.CloseConnection();
app.Run();

