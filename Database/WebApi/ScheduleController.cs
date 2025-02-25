

using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("schedule/")]
    public class ScheduleController : ControllerBase
    {
        private readonly IDatabase<Schedule,int> _scheduleContext;

        public ScheduleController(ScheduleContext context)
        {
            _scheduleContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedule(int id)
        {
            try
            {
                Schedule schedule = await _scheduleContext.ReadAsync(id,true,true);
                if (schedule == null) return NotFound("Schedule not found");
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]        
        public async Task<IActionResult> PostSchedule([FromBody] Schedule data)
        {
            try
            {
                await _scheduleContext.CreateAsync(data);

                return Ok("Schedule added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid schedule data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateSchedule([FromBody]Schedule schedule)
        {
            try
            {
                await _scheduleContext.UpdateAsync(schedule,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update schedule data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PatchSchedule([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Schedule schedule = await _scheduleContext.ReadAsync(Convert.ToInt32(data["id"]),true);
                
                if (schedule == null) return NotFound("Schedule not found");
                bool useNavigationalProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "restDays":
                            schedule.RestDays = JsonConvert.DeserializeObject<List<byte>>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "workouts":
                            schedule.Workouts = JsonConvert.DeserializeObject<List<Workout>>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                    }
                }
                
                await _scheduleContext.UpdateAsync(schedule,useNavigationalProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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
