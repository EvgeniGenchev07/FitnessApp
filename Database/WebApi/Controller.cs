using DBContexts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            return Ok(new User()
            {
                UserName = "newUser",
                Password = "password123",
                Email = "newuser@example.com",
                Age = 25,
                Height = 180
            });
        }

        [HttpPost("{data}")]
        public IActionResult PostUser([FromBody] User data)
        {
            try
            {
                _dbContext.Users.Add(data);
                _dbContext.SaveChanges();

                return Ok("User added successfully");
            }
            catch (DbUpdateException e)
            {
                return BadRequest("Invalid user data.");
            }
            catch (Exception e)
            {
                return BadRequest("An unexpected error occured.");
            }

        }

    }
}
