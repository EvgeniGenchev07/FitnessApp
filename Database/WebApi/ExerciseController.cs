using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("exercise/")]
    public class ExerciseController : ControllerBase
    {
        private readonly IDatabase<Exercise,int> _exerciseContext;

        public ExerciseController(IDatabase<Exercise,int> context)
        {
            _exerciseContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExercise(int id)
        {
            try
            {
                Exercise exercise = await _exerciseContext.ReadAsync(id);
                if (exercise == null) return NotFound("Exercise not found");
                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
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

        [HttpPatch("{data}")]
        public async Task<IActionResult> UpdateExercise(Exercise exercise)
        {
            try
            {
                await _exerciseContext.UpdateAsync(exercise);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update exercise data");
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
