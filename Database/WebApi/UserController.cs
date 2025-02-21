using DBContexts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;

namespace WebApi
{
    [ApiController]
    [Route("user/")]
    public class UserController : ControllerBase
    {
        private readonly IDatabase<User, string> _userContext;

        public UserController(UserContext context)
        {
            _userContext = context;
        }

        [HttpGet("{email}")]
        public async Task<IActionResult> GetUser(string email)
        {
            try
            {
                /*return Ok(new User()
                {
                    Id = 1, UserName = "newUser", Password = "password123", Email = "newu@example.com", Age = 25,
                    Measurements = null, Workouts = null, Meals = null, Schedule = new Schedule()
                    {
                        Workouts = new List<Workout>()
                        {
                            new Workout()
                            {
                                Id = 1,
                                WorkoutExercises = new List<WorkoutExercise>()
                                {
                                    new WorkoutExercise()
                                    {
                                        Id = 1,
                                    }
                                }
                            }
                        }
                    }, Height = 180
                });*/
                User user = await _userContext.ReadAsync(email);
                if (user == null) return NotFound("User not found");
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] User data)
        {
            try
            {
                await _userContext.CreateAsync(data);
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

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User data)
        {
            try
            {
                await _userContext.UpdateAsync(data);
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
                User user = await _userContext.ReadAsync(data["email"].ToString());
                
                if (user == null) return NotFound("User not found");
                
                foreach (var pair in data)
                {
                    switch (pair.Key)
                    {
                        case "newEmail":
                            user.Email = pair.Value.ToString();
                            break;
                        case "username":
                            user.UserName = pair.Value.ToString();
                            break;
                        case "password":
                            user.Password = pair.Value.ToString();
                            break;
                        case "age":
                            user.Age = Convert.ToInt32(pair.Value.ToString());
                            break;
                        case "height":
                            user.Height = Convert.ToByte(pair.Value.ToString());
                            break;
                        case "meals":
                            user.Meals = (List<Meal>)pair.Value;
                            break;
                        case "schedule":
                            user.Schedule = (Schedule)pair.Value;
                            break;
                        case "workouts":
                            user.Workouts = (List<Workout>)pair.Value;
                            break;
                        case "measurements":
                            user.Measurements = (List<Measurement>)pair.Value;
                            break;
                    }
                }
                
                await _userContext.UpdateAsync(user);
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
