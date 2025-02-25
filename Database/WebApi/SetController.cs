using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("set/")]
    public class SetController : ControllerBase
    {
        private readonly IDatabase<Set,int> _setContext;

        public SetController(SetContext context)
        {
            _setContext = context;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSet(int id)
        {
            try
            {
                Set set = await _setContext.ReadAsync(id,true,true);
                if (set == null) return NotFound("Set not found");
                return Ok(set);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostSet([FromBody] Set data)
        {
            try
            {
                await _setContext.CreateAsync(data);

                return Ok("Set added successfully");
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Invalid set data.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPut]
        public async Task<IActionResult> UpdateSet([FromBody]Set set)
        {
            try
            {
                await _setContext.UpdateAsync(set,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update set data");
            }
        }
        
        [HttpPatch]
        public async Task<IActionResult> PatchSet([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Set set = await _setContext.ReadAsync(Convert.ToInt32(data["id"]),false);
                
                if (set == null) return NotFound("Set not found");
                bool useNavigationProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "reps":
                            set.Reps = Convert.ToByte(pair.Value);
                            break;
                        case "weight":
                            set.Weight = Convert.ToDouble(pair.Value);
                            break;
                    }
                }
                
                await _setContext.UpdateAsync(set,useNavigationProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpDelete("{email}")]
        public async Task<IActionResult> DeleteSet(int id)
        {
            try
            {
                await _setContext.DeleteAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

}
