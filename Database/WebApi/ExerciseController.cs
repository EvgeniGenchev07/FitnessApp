using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DBContexts;
using Models;
using System.Text.Json;

namespace WebApi
{
    [Route("/exercise")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly ExerciseContext _exerciseContext;
        private readonly AthloboostDbContext _dbContext;
        public ExerciseController(ExerciseContext context,AthloboostDbContext _athloboostDb)
        {
            _exerciseContext = context;
            _dbContext = _athloboostDb;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExercise(
            [FromForm] string Name,
            [FromForm] int EstimatedTime,
            [FromForm] string Level,
            [FromForm] IFormFile Photo,
            [FromForm] string PhotoMimeType,
            [FromForm] string Sets)
        {
            try
            {
                var exercise = new Exercise
                {
                    Name = Name,
                    EstimatedTime = EstimatedTime,
                    Level = Level,
                    PhotoMimeType = PhotoMimeType,
                    Sets = JsonSerializer.Deserialize<List<Set>>(Sets) ?? new List<Set>()
                };

                if (Photo != null && Photo.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await Photo.CopyToAsync(memoryStream);
                    exercise.Photo = memoryStream.ToArray();
                }

                await _exerciseContext.CreateAsync(exercise);

                return Ok(new { message = "Exercise created successfully", exercise.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

