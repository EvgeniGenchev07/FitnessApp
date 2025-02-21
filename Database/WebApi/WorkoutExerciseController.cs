using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("workoutexercise/")]
    public class WorkoutExerciseController : ControllerBase
    {
        private readonly IDatabase<WorkoutExercise, int> _workoutExerciseContext;

        public WorkoutExerciseController(WorkoutExerciseContext context)
        {
            _workoutExerciseContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkoutExercise(int id)
        {
            try
            {
                WorkoutExercise workoutExercise = await _workoutExerciseContext.ReadAsync(id);
                if (workoutExercise == null) return NotFound("Workout exercise not found");
                return Ok(workoutExercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostWorkoutExercise([FromBody] WorkoutExercise data)
        {
            try
            {
                await _workoutExerciseContext.CreateAsync(data);

                return Ok("Workout exercise added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid workout exercise data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateWorkoutExercise([FromBody]WorkoutExercise workoutExercise)
        {
            try
            {
                await _workoutExerciseContext.UpdateAsync(workoutExercise);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update workout exercise data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PutUser([FromBody] Dictionary<string, object> data)
        {
            try
            {
                WorkoutExercise workoutExercise = await _workoutExerciseContext.ReadAsync(Convert.ToInt32(data["id"]));
                
                if (workoutExercise == null) return NotFound("WorkoutExercise not found");
                
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "exercise":
                            workoutExercise.Exercise = (Exercise)pair.Value;
                            break;
                        case "sets":
                            workoutExercise.Sets = (List<Set>)pair.Value;
                            break;
                        case "workout":
                            workoutExercise.Workout = (Workout)pair.Value;
                            break;
                    }
                }
                
                await _workoutExerciseContext.UpdateAsync(workoutExercise);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteSet(int id)
        {
            try
            {
                await _workoutExerciseContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
