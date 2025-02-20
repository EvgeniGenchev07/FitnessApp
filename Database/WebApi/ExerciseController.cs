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
        private readonly ApiDbContext _dbContext;

        public ExerciseController(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExercise(int id)
        {
            try
            {
                Exercise exercise = await _dbContext.GetExercise(id);
                if (exercise == null) return NotFound("User not found");
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
                await _dbContext.AddExercise(data);

                return Ok("User added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid user data.");
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
                await _dbContext.UpdateExercise(exercise);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            try
            {
                await _dbContext.DeleteExercise(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
