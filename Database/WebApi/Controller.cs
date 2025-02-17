using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace WebApi
{
    [ApiController]
    [Route("server/")]
    public class Controller : ControllerBase
    {
        private readonly ApiDbContext _dbContext;
        public Controller(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("user")]
        public IActionResult GetUser() 
        {
            return Ok (new User()
            {
                UserName = "newUser",
                Password = "password123",
                Email = "newuser@example.com",
                Age = 25,
                Height = 180
            });
        }

        [HttpPost("user/post/{data}")]
        public IActionResult PostUser(string data)
        {
            return _dbContext.AddUser(JsonConvert.DeserializeObject<User>(data)).Exception == null? BadRequest() : Ok();

        }

    }
}
