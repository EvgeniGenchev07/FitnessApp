using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("workoutexercise/")]
    public class WorkoutExerciseController : ControllerBase
    {
        private readonly IDatabase<Workout, int> _workoutExerciseContext;

        public WorkoutExerciseController(IDatabase<Workout, int> context)
        {
            _workoutExerciseContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkoutExercise(int id)
        {
            try
            {
                Workout workoutExercise = await _workoutExerciseContext.ReadAsync(id);
                if (workoutExercise == null) return NotFound("Workout exercise not found");
                return Ok(workoutExercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostWorkoutExercise([FromBody] Workout data)
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

        [HttpPatch("{data}")]
        public async Task<IActionResult> UpdateWorkoutExercise(Workout workoutExercise)
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
