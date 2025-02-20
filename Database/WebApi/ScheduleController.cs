

using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace WebApi
{
    [ApiController]
    [Route("schedule/")]
    public class ScheduleController : ControllerBase
    {
        private readonly IDatabase<Schedule,int> _scheduleContext;

        public ScheduleController(IDatabase<Schedule,int> context)
        {
            _scheduleContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedule(int id)
        {
            try
            {
                Schedule schedule = await _scheduleContext.ReadAsync(id);
                if (schedule == null) return NotFound("User not found");
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("{data}")]
        public async Task<IActionResult> PostSchedule([FromBody] Schedule data)
        {
            try
            {
                await _scheduleContext.CreateAsync(data);

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
        public async Task<IActionResult> UpdateSchedule(Schedule schedule)
        {
            try
            {
                await _scheduleContext.UpdateAsync(schedule);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            try
            {
                await _scheduleContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
