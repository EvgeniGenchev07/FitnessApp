using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("food/")]
    public class FoodController : ControllerBase
    {
        private readonly ApiDbContext _dbContext;

        public FoodController(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFood(int id)
        {
            try
            {
                Food food = await _dbContext.GetFood(id);
                if (food == null) return NotFound("User not found");
                return Ok(food);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostFood([FromBody] Food data)
        {
            try
            {
                await _dbContext.AddFood(data);

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
        public async Task<IActionResult> UpdateFood(Food food)
        {
            try
            {
                await _dbContext.UpdateFood(food);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            try
            {
                await _dbContext.DeleteFood(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
