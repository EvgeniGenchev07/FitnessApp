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
        private readonly IDatabase<Meal,int> _mealContext;

        public MealController(IDatabase<Meal,int> context)
        {
            _mealContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeal(int id)
        {
            try
            {
                Meal meal = await _mealContext.ReadAsync(id);
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
                await _mealContext.CreateAsync(data);

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
                await _mealContext.UpdateAsync(meal);
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
                await _mealContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
