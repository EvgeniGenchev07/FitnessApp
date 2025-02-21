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
        private readonly IDatabase<Food,int> _foodContext;

        public FoodController(FoodContext context)
        {
            _foodContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFood(int id)
        {
            try
            {
                Food food = await _foodContext.ReadAsync(id);
                if (food == null) return NotFound("Food not found");
                return Ok(food);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostFood([FromBody] Food data)
        {
            try
            {
                await _foodContext.CreateAsync(data);

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

        [HttpPatch]
        public async Task<IActionResult> UpdateFood([FromBody] Food food)
        {
            try
            {
                await _foodContext.UpdateAsync(food);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update food data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            try
            {
                await _foodContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
