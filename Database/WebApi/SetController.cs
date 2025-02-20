using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("set/")]
    public class SetController : ControllerBase
    {
        private readonly IDatabase<Set,int> _setContext;

        public SetController(IDatabase<Set,int> context)
        {
            _setContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSet(int id)
        {
            try
            {
                Set set = await _setContext.ReadAsync(id);
                if (set == null) return NotFound("User not found");
                return Ok(set);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostSet([FromBody] Set data)
        {
            try
            {
                await _setContext.CreateAsync(data);

                return Ok("Food added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid food data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPatch("{data}")]
        public async Task<IActionResult> UpdateSet(Set set)
        {
            try
            {
                await _setContext.UpdateAsync(set);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteSet(int id)
        {
            try
            {
                await _setContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
