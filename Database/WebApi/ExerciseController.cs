using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("exercise/")]
    public class ExerciseController : ControllerBase
    {
        private readonly IDatabase<Exercise,int> _exerciseContext;

        public ExerciseController(ExerciseContext context)
        {
            _exerciseContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExercise(int id)
        {
            try
            {
                Exercise exercise = await _exerciseContext.ReadAsync(id,true,true);
                if (exercise == null) return NotFound("Exercise not found");
                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostExercise([FromBody] Exercise data)
        {
            try
            {
                await _exerciseContext.CreateAsync(data);

                return Ok("Exercise added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid exercise data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateExercise([FromBody]Exercise exercise)
        {
            try
            {
                await _exerciseContext.UpdateAsync(exercise,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update exercise data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PatchExercise([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Exercise exercise = await _exerciseContext.ReadAsync(Convert.ToInt32(data["id"]),true,false);
                
                if (exercise == null) return NotFound("Exercise not found");
                bool useNavigationProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "name":
                            exercise.Name = pair.Value.ToString();
                            break;
                        case "carbs":
                            exercise.MuscleGroups = JsonConvert.DeserializeObject<List<MuscleGroups>>(pair.Value.ToString());
                            break;
                    }
                }
                
                await _exerciseContext.UpdateAsync(exercise,useNavigationProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            try
            {
                await _exerciseContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
