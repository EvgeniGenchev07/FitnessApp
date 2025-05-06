using DBContexts;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("user/")]
    [EnableCors("Disable cross-origin")]
    public class UserController : ControllerBase
    {
        private readonly IDatabase<User, string> _userContext;
        private readonly UserLogin _userLoginContext;

        public UserController(UserContext context, UserLogin userLogin)
        {
            _userContext = context;
            _userLoginContext = userLogin;
        }

        [HttpPost]
        [Route("workouts")]
        public async Task<IActionResult> GetWorkouts([FromBody]string email)
        {
            try
            {
                User user = await _userContext.ReadAsync(email, true, true);
                if (user == null) return NotFound("User not found");
                return Ok(user.Workouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("user")]
        public async Task<IActionResult> GetUserProfile([FromBody] Dictionary<string,object> data)
        {
            try
            {
                User user = await _userContext.ReadAsync(data["email"].ToString(), true, true);
                if (user == null) return NotFound(Error.UserNotFound);
                user.Password = "";
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> GetUser([FromBody] Dictionary<string,object> data)
        {
            try
            {
                
                Tuple<byte,User> response = await _userLoginContext.Login(data["email"].ToString(), data["password"].ToString());
                if (response.Item1 == (byte)Error.Ok)
                {
                    return Ok(response.Item2);
                }
                return NotFound(response.Item1);
             /*   if (user == null) return NotFound("User not found");
                if (user.Password != password) return Unauthorized();
                user.Password = "";
                return Ok(user);*/
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        
        

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> PostUser([FromBody] User data)
        {
            try
            {
                byte response = await _userLoginContext.Register(data);
                if(response == (byte)Error.Ok) return Ok(response);
                return NotFound(response);
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

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User data)
        {
            try
            {
                await _userContext.UpdateAsync(data,true);
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                return BadRequest("Couldn't update user data");
            }
        }

        [HttpPatch]
        public async Task<IActionResult> PutUser([FromBody] Dictionary<string,object> data)
        {
            try
            {
                User user = await _userContext.ReadAsync(data["email"].ToString(),true);
                
                if (user == null) return NotFound("User not found");
                bool useNavigationalProperties = false;
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "newEmail":
                            user.Email = pair.Value.ToString();
                            break;
                        case "userName":
                            user.UserName = pair.Value.ToString();
                            break;
                        case "bio":
                            user.Bio = pair.Value.ToString();
                            break;
                        case "photo":
                            user.Photo = Convert.FromBase64String(pair.Value.ToString());
                            break;
                        case "password":
                            user.Password = pair.Value.ToString();
                            break;
                        case "height":
                            user.Height = Convert.ToByte(pair.Value);
                            break;
                        case "meals":
                            user.Meals = JsonConvert.DeserializeObject<List<Meal>>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "schedule":
                            user.Schedule = JsonConvert.DeserializeObject<Schedule>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "workouts":
                            user.Workouts = JsonConvert.DeserializeObject<List<Workout>>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "measurements":
                            user.Measurements = JsonConvert.DeserializeObject<List<Measurement>>(pair.Value.ToString());
                            useNavigationalProperties = true;
                            break;
                    }
                }
                
                await _userContext.UpdateAsync(user,useNavigationalProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{email}")] 
        public async Task<IActionResult> DeleteUser( string email)
        {
            try
            {
                await _userContext.DeleteAsync(email);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

       
    }
}
