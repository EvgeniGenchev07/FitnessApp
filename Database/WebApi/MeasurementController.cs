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
        private readonly IDatabase<Measurement,int> _measurementContext;

        public MeasurementController(MeasurementContext context)
        {
            _measurementContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMeasurement(int id)
        {
            try
            {
                Measurement meal = await _measurementContext.ReadAsync(id);
                if (meal == null) return NotFound("Measurement not found");
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
                await _measurementContext.CreateAsync(data);

                return Ok("Measurement added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid measurement data.");
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
                await _measurementContext.UpdateAsync(measurement);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update measurement data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteMeasurement(int id)
        {
            try
            {
                await _measurementContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
