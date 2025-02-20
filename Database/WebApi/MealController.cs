using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("meal/")]
    public class MealController : ControllerBase
    {
        private readonly ApiDbContext _dbContext;

        public MealController(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeal(int id)
        {
            try
            {
                Meal meal = await _dbContext.GetMeal(id);
                if (meal == null) return NotFound("User not found");
                return Ok(meal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostMeal([FromBody] Meal data)
        {
            try
            {
                await _dbContext.AddMeal(data);

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
        public async Task<IActionResult> UpdateMeal(Meal meal)
        {
            try
            {
                await _dbContext.UpdateMeal(meal);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteMeal(int id)
        {
            try
            {
                await _dbContext.DeleteMeal(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
