using DBContexts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [Route("food")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly FoodContext _foodContext;
        private readonly AthloboostDbContext _context;
        public FoodController(FoodContext foodContext, AthloboostDbContext context)
        {
            _foodContext = foodContext;
            _context = context;
        }

        // GET: api/Food/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Food>> GetFood(int id)
        {
            var food = await _foodContext.ReadAsync(id, false);

            if (food == null)
                return NotFound();

            return Ok(food);
        }

        // POST: api/Food
        [HttpPost]
        public async Task<ActionResult> CreateFood([FromBody] Food food)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _foodContext.CreateAsync(food);
            return CreatedAtAction(nameof(GetFood), new { id = food.Id }, food);
        }

        // PUT: api/Food/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFood(int id, [FromBody] Food food)
        {
            if (id != food.Id)
                return BadRequest("IDs don't match.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingFood = await _foodContext.ReadAsync(id, false);
            if (existingFood == null)
                return NotFound();

            await _foodContext.UpdateAsync(food, false);
            return NoContent();
        }

        // DELETE: api/Food/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFood(int id)
        {
            var food = await _foodContext.ReadAsync(id, false);
            if (food == null)
                return NotFound();

            await _foodContext.DeleteAsync(id);
            return NoContent();
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Food>>> GetAllFoods()
        {
            var foods = await _context.Foods.ToListAsync();
            return Ok(foods);
        }
    }
}
