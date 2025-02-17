using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;

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
        public IActionResult PostUser([FromBody] User data)
        {
            
                return BadRequest("Invalid user data.");

            /*_dbContext.Users.Add(data);
            _dbContext.SaveChanges(); // Ensure changes are saved to the database

            return Ok(new { message = "User added successfully", user = data });*/

        }

    }
}
