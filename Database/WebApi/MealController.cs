using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("meal/")]
    public class MealController : ControllerBase
    {
        private readonly IDatabase<Meal,int> _mealContext;

        public MealController(MealContext context)
        {
            _mealContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeal(int id)
        {
            try
            {
                Meal meal = await _mealContext.ReadAsync(id,true,true);
                if (meal == null) return NotFound("Meal not found");
                return Ok(meal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostMeal([FromBody] Meal data)
        {
            try
            {
                await _mealContext.CreateAsync(data);

                return Ok("Meal added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid meal data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateMeal([FromBody]Meal meal)
        {
            try
            {
                await _mealContext.UpdateAsync(meal,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update meal data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PutUser([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Meal meal = await _mealContext.ReadAsync(Convert.ToInt32(data["id"]),true);
                
                if (meal == null) return NotFound("Meal not found");
                bool useNavigationalPropertes = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "date":
                            meal.Date = Convert.ToDateTime(pair.Value);
                            break;
                        case "weight":
                            meal.Weight = Convert.ToUInt16(pair.Value);
                            break;
                        case "food":
                            meal.Food = JsonConvert.DeserializeObject<Food>(pair.Value.ToString());
                            meal.FoodId = meal.Food.Id;
                            useNavigationalPropertes = true;
                            break;
                    }
                }
                
                await _mealContext.UpdateAsync(meal,useNavigationalPropertes);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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
