using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitnessApp.Database.Models;
using FitnessApp.Database;

namespace FitnessApp.Database.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NutritionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NutritionController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("daily/{userId}")]
        public async Task<ActionResult<IEnumerable<Nutrition>>> GetDailyNutrition(string userId, [FromQuery] DateTime date)
        {
            var nutrition = await _context.Nutrition
                .Where(n => n.UserId == userId && n.Date.Date == date.Date)
                .OrderBy(n => n.MealType)
                .ToListAsync();

            return Ok(nutrition);
        }

        [HttpPost]
        public async Task<ActionResult<Nutrition>> AddNutrition(Nutrition nutrition)
        {
            nutrition.Date = DateTime.UtcNow;
            _context.Nutrition.Add(nutrition);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDailyNutrition), new { userId = nutrition.UserId, date = nutrition.Date }, nutrition);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNutrition(int id)
        {
            var nutrition = await _context.Nutrition.FindAsync(id);
            if (nutrition == null)
            {
                return NotFound();
            }

            _context.Nutrition.Remove(nutrition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("stats/{userId}")]
        public async Task<ActionResult<object>> GetNutritionStats(string userId)
        {
            var today = DateTime.UtcNow.Date;
            var nutrition = await _context.Nutrition
                .Where(n => n.UserId == userId && n.Date.Date == today)
                .ToListAsync();

            var totalCalories = nutrition.Sum(n => n.Calories);
            var mealsByType = nutrition
                .GroupBy(n => n.MealType)
                .ToDictionary(g => g.Key, g => g.Sum(n => n.Calories));

            return Ok(new
            {
                totalCalories,
                mealsByType
            });
        }
    }
} 