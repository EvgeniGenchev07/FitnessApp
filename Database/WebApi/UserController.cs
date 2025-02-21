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
    public class UserController : ControllerBase
    {
        private readonly IDatabase<User,string> _userContext;

        public UserController(UserContext context)
        {
            _userContext = context;
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            try
            {
                User user = await _userContext.ReadAsync(email);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] User data)
        {
            try
            {
                await _userContext.CreateAsync(data);
                return Ok("User added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid user data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPatch]
        public async Task<IActionResult> UpdateUser([FromBody]User data)
        {
            try
            {
                await _userContext.UpdateAsync(data);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")] 
        public async Task<IActionResult> DeleteUser( string email)
        {
            try
            {
                await _userContext.DeleteAsync(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

            
    }
}
