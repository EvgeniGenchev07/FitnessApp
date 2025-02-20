using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("measurement/")]
    public class MeasurementController : ControllerBase
    {
        private readonly ApiDbContext _dbContext;

        public MeasurementController(ApiDbContext context)
        {
            _dbContext = context;
            _dbContext.Database.EnsureCreated();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeasurement(int id)
        {
            try
            {
                Measurement meal = await _dbContext.GetMeasurement(id);
                if (meal == null) return NotFound("User not found");
                return Ok(meal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostMeasurement([FromBody] Measurement data)
        {
            try
            {
                await _dbContext.AddMeasurement(data);

                return Ok("Food added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid food data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPatch("{data}")]
        public async Task<IActionResult> UpdateMeasurement(Measurement measurement)
        {
            try
            {
                await _dbContext.UpdateMeasurement(measurement);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteMeasurement(int id)
        {
            try
            {
                await _dbContext.DeleteMeasurement(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
