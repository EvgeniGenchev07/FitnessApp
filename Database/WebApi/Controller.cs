using DBContexts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("user/")]
    public class Controller : ControllerBase
    {
        private readonly ApiDbContext _dbContext;

        public Controller(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("{email}")]
        public ActionResult GetUser(string email)
        {
            try
            {
                User user = _dbContext.GetUser(email);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
            catch (Exception ex) 
            {
                return StatusCode(500, ex.Message);
            }
            
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
                return StatusCode(500, e.Message);
            }

        }

            
    }
}
