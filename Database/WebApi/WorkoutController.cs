using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("workout/")]
    public class WorkoutController : ControllerBase
    {
        private readonly IDatabase<Workout, int> _workoutContext;

        public WorkoutController(WorkoutContext context)
        {
            _workoutContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkout(int id)
        {
            try
            {
                Workout workoutExercise = await _workoutContext.ReadAsync(id,true,true);
                if (workoutExercise == null) return NotFound("Workout not found");
                return Ok(workoutExercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostWorkout([FromBody] Workout data)
        {
            try
            {
                await _workoutContext.CreateAsync(data);

                return Ok("Workout added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid workout data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateWorkout([FromBody]Workout workoutExercise)
        {
            try
            {
                await _workoutContext.UpdateAsync(workoutExercise,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update workout data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PatchWorkout([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Workout workout = await _workoutContext.ReadAsync(Convert.ToInt32(data["id"]),true);
                
                if (workout == null) return NotFound("Workout not found");
                bool useNavigationalProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "date":
                            workout.Date = Convert.ToDateTime(pair.Value);
                            break;
                        case "workoutExercises":
                            workout.WorkoutExercises = (List<WorkoutExercise>)pair.Value;
                            useNavigationalProperties = true;
                            break;
                    }
                }
                
                await _workoutContext.UpdateAsync(workout,useNavigationalProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            try
            {
                await _workoutContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
