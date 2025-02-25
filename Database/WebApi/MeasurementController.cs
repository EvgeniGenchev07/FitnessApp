using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

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
                Measurement meal = await _measurementContext.ReadAsync(id,true,true);
                if (meal == null) return NotFound("Measurement not found");
                return Ok(meal);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost]
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

        [HttpPut]
        public async Task<IActionResult> UpdateMeasurement([FromBody]Measurement measurement)
        {
            try
            {
                await _measurementContext.UpdateAsync(measurement,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update measurement data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PatchMeasurement([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Measurement measurement = await _measurementContext.ReadAsync(Convert.ToInt32(data["id"]),true);
                
                if (measurement == null) return NotFound("Measurement not found");
                bool useNavigationalProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "arm":
                            measurement.Arm = Convert.ToDouble(pair.Value);
                            break;
                        case "calf":
                            measurement.Calf = Convert.ToDouble(pair.Value);
                            break;
                        case "chest":
                            measurement.Chest = Convert.ToDouble(pair.Value);
                            break;
                        case "waist":
                            measurement.Waist = Convert.ToDouble(pair.Value);
                            break;
                        case "forearm":
                            measurement.Forearm = Convert.ToDouble(pair.Value);
                            break;
                        case "date":
                            measurement.Date = Convert.ToDateTime(pair.Value);
                            break;
                        case "weight":
                            measurement.Weight = Convert.ToDouble(pair.Value);
                            break;
                    }
                }
                
                await _measurementContext.UpdateAsync(measurement,useNavigationalProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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
