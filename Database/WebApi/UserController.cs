using DBContexts;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using Newtonsoft.Json;
using System.Text.Json;

namespace WebApi
{
    [ApiController]
    [Route("user/")]
    [EnableCors("Disable cross-origin")]
    public class UserController : ControllerBase
    {
        private readonly UserContext _userContext;
        private readonly UserLogin _userLoginContext;
        private readonly AthloboostDbContext _dbContext;

        public UserController(UserContext context, UserLogin userLogin, AthloboostDbContext dbContext)
        {
            _userContext = context;
            _userLoginContext = userLogin;
            _dbContext = dbContext;
        }

        public class DeleteUserRequest
        {
            public string Email { get; set; }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                var user = await _userContext.GetUserByIdAsync(userId);

                if (user == null)
                {
                    return NotFound($"User with ID {userId} not found");
                }

                return Ok(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.Bio,
                    Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : null,
                    user.Height,
                    user.Facebook,
                    user.X,
                    user.Instagram,
                    user.FollowerIds,
                    user.FollowingIds,
                    user.CreationDate,
                    Password = "",
                    Posts = user.Posts?.Select(p => new {
                        p.Id,
                        p.Title,
                        p.Description,
                        p.Created,
                        Image = p.Photo != null ? Convert.ToBase64String(p.Photo) : null,
                        p.PhotoMimeType
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
                Console.WriteLine(JsonConvert.SerializeObject(user));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> GetUser([FromBody] Dictionary<string, object> data)
        {
            try
            {

                Tuple<byte, User> response = await _userLoginContext.Login(data["email"].ToString(), data["password"].ToString());
                if (response.Item1 == (byte)Error.Ok)
                {
                    User user = response.Item2;
                    return Ok(new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        user.Bio,
                        Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : null,
                        user.Height,
                        user.Facebook,
                        user.X,
                        user.Instagram,
                        user.FollowerIds,
                        user.FollowingIds,
                        user.CreationDate,
                        Password = "",
                        Posts = user.Posts?.Select(p => new
                        {
                            p.Id,
                            p.Title,
                            p.Description,
                            p.Created,
                            Image = p.Photo != null ? Convert.ToBase64String(p.Photo) : null
                        }),
                        Workouts = user.Workouts?.Select(w => new
                        {
                            w.Id,
                            w.Title,
                            Exercises = w.Exercises?.Select(e => new
                            {
                                e.Name,
                                e.EstimatedTime,
                                Sets = e.Sets?.Select(s => new
                                {
                                    s.Reps,
                                    s.Weight,
                                    s.RestTime
                                })
                            })
                        }),
                        Meals = user.Meals,
                        Schedule = user.Schedule
                    });
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
        [Route("login/js")]
        public async Task<IActionResult> GetUserJs([FromBody] Dictionary<string, object> data)
        {
            try
            {
                Tuple<byte, User> response = await _userLoginContext.Login(data["email"].ToString(), data["password"].ToString());

                if (response.Item1 == (byte)Error.Ok)
                {
                    var user = response.Item2;
                    var userResponse = new
                    {
                        user.Id,
                        user.UserName,
                        user.Email,
                        user.Bio,
                        Photo = user.Photo != null ? Convert.ToBase64String(user.Photo) : null,
                        user.Height,
                        user.Weight,
                        user.Facebook,
                        user.X,
                        user.Instagram,
                        user.FollowerIds,
                        user.FollowingIds,
                        user.CreationDate,
                        Password = "",
                        Posts = user.Posts?.Select(p => new {
                            p.Id,
                            p.Title,
                            p.Description,
                            p.Created,
                            Image = p.Photo != null ? Convert.ToBase64String(p.Photo) : null
                        }),
                        Workouts = user.Workouts?.Select(w => new
                        {
                            w.Id,
                            w.Title,
                            Exercises = w.Exercises?.Select(e => new
                            {
                                e.Name,
                                e.EstimatedTime,
                                Sets = e.Sets?.Select(s => new
                                {
                                    s.Reps,
                                    s.Weight,
                                    s.RestTime
                                })
                            })
                        }),
                    };// работи така,но трябва да ги довърша и за другите трябва ъпдейт на локалната сесия в js

                    return Ok(userResponse);
                }
                return NotFound(response.Item1);
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
                User user = await _userContext.ReadAsync(data["email"].ToString(),true,false);
                Console.WriteLine(data.ContainsKey("photo"));
                if (user == null) return NotFound("User not found");
                foreach (var pair in data)
                {
                    Console.WriteLine($"{pair.Key}: {pair.Value}");
                    switch (pair.Key)
                    {
                        case "newEmail":
                            user.Email = pair.Value.ToString();
                            break;
                        case "userName":
                            user.UserName = pair.Value.ToString();
                            break;
                        case "bio":
                            if(pair.Value is not null) user.Bio = pair.Value.ToString();
                            break;
                        case "photo":
                            if(pair.Value.ToString() != "[]") user.Photo = Convert.FromBase64String(pair.Value.ToString());
                            break;
                        case "password":
                            user.Password = pair.Value.ToString();
                            break;
                        case "height":
                            user.Height = Convert.ToByte(pair.Value);
                            break;
                        case "meals":
                            Meal meal = JsonConvert.DeserializeObject<Meal>(pair.Value.ToString());
                            Meal mealDb = user.Meals.FirstOrDefault(w=>w.Id == meal.Id);
                            if (mealDb != null)
                            {
                                Console.WriteLine(meal.WeightGoal);
                                mealDb.Weight = meal.Weight;
                                mealDb.WeightGoal = meal.WeightGoal;
                                mealDb.WaterGoal = meal.WaterGoal;
                                mealDb.DailyCalorieGoal = meal.DailyCalorieGoal;
                                mealDb.WaterIntake = meal.WaterIntake;
                                mealDb.Foods = meal.Foods!=null? meal.Foods.Select(f => new Food
                                {
                                    Name = f.Name,
                                    Calories = f.Calories,
                                    Carbs = f.Carbs,
                                    Fats = f.Fats,
                                    Proteins = f.Proteins,
                                    Type = f.Type,
                                }).ToList():new List<Food>();
                            }
                            else
                            {
                                user.Meals.Add(new Meal
                                {
                                    Weight = meal.Weight,
                                    WeightGoal = meal.WeightGoal,
                                    WaterGoal = meal.WaterGoal,
                                    WaterIntake = meal.WaterIntake,
                                    DailyCalorieGoal = meal.DailyCalorieGoal,
                                    Date = meal.Date,
                                    Foods = meal.Foods!=null? meal.Foods.Select(f => new Food
                                    {
                                        Name = f.Name,
                                        Calories = f.Calories,
                                        Carbs = f.Carbs,
                                        Fats = f.Fats,
                                        Proteins = f.Proteins,
                                        Type = f.Type,
                                    }).ToList():new List<Food>()
                                });
                            }
                            break;
                        case "schedule":
                            user.Schedule = JsonConvert.DeserializeObject<Schedule>(pair.Value.ToString());
                            break;
                        case "workout":
                            Workout workout = JsonConvert.DeserializeObject<Workout>(pair.Value.ToString());
                            Workout workoutDb = user.Workouts.FirstOrDefault(w=>w.Id == workout.Id);
                            if (workoutDb != null)
                            {
                                workoutDb.Title = workout.Title;
                                workoutDb.Exercises = workout.Exercises.Select(e => new Exercise
                                {
                                    Name = e.Name,
                                    EstimatedTime = e.EstimatedTime,
                                    Sets = e.Sets.Select(s => new Set
                                    {
                                        Reps = s.Reps,
                                        Weight = s.Weight,
                                        RestTime = s.RestTime
                                    }).ToList()
                                }).ToList();
                            }
                            else
                            {
                                user.Workouts.Add(new Workout
                                {
                                    Title = workout.Title,
                                    Exercises = workout.Exercises.Select(e => new Exercise
                                    {
                                        Name = e.Name,
                                        EstimatedTime = e.EstimatedTime,
                                        Sets = e.Sets.Select(s => new Set
                                        {
                                            Reps = s.Reps,
                                            Weight = s.Weight,
                                            RestTime = s.RestTime
                                        }).ToList()
                                    }).ToList()
                                });
                            }

                            break;
                        case "rmWorkout":
                            int workoutId = Convert.ToInt32(pair.Value.ToString());
                            Workout rmWorkoutDb = user.Workouts.FirstOrDefault(w => w.Id == workoutId);
                            if (rmWorkoutDb != null)
                            {
                                user.Workouts.Remove(rmWorkoutDb);
                            }
                            break;
                        case "post":
                            Post post = JsonConvert.DeserializeObject<Post>(pair.Value.ToString());
                            Post postDb = user.Posts.FirstOrDefault(p=>p.Id == post.Id);
                            if (postDb != null)
                            {
                                postDb.Description = post.Description;
                                postDb.Photo = post.Photo;
                            }
                            else
                            {
                                user.Posts.Add(new Post
                                {
                                    Description = post.Description,
                                    Photo = post.Photo,
                                    Created = DateTime.Now,
                                });
                            }
                            break;
                    }
                }
                await _dbContext.SaveChangesAsync();
                return Ok(1);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
        [Route("js")]
        [HttpPatch]
        public async Task<IActionResult> PutUserWithJs([FromBody] Dictionary<string, object> data)
        {
            try
            {
                User user = await _userContext.ReadAsync(data["email"].ToString(), true);

                if (user == null) return NotFound("User not found");

                bool useNavigationalProperties = false;

                foreach (var pair in data)
                {
                    object value = pair.Value;
                    if (value is JsonElement jsonElement)
                    {
                        value = jsonElement.ValueKind switch
                        {
                            JsonValueKind.String => jsonElement.GetString(),
                            JsonValueKind.Number => jsonElement.GetDecimal(),
                            JsonValueKind.True => true,
                            JsonValueKind.False => false,
                            JsonValueKind.Null => null,
                            _ => value
                        };
                    }

                    switch (pair.Key)
                    {
                        case "newEmail":
                            user.Email = value?.ToString();
                            break;
                        case "username":
                            user.UserName = value?.ToString();
                            break;
                        case "bio":
                            user.Bio = value?.ToString();
                            break;
                        case "photo":
                            user.Photo = Convert.FromBase64String(value?.ToString());
                            break;
                        case "password":
                            user.Password = value?.ToString();
                            break;
                        case "height":
                            if (value != null)
                                user.Height = Convert.ToByte(value);
                            break;
                        case "weight":
                            if (value != null)
                                user.Weight = Convert.ToByte(value);
                            break;
                        case "meals":
                            user.Meals = JsonConvert.DeserializeObject<List<Meal>>(value?.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "schedule":
                            user.Schedule = JsonConvert.DeserializeObject<Schedule>(value?.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "workouts":
                            user.Workouts = JsonConvert.DeserializeObject<List<Workout>>(value?.ToString());
                            useNavigationalProperties = true;
                            break;
                        case "photoMimeType":
                            user.PhotoMimeType = value?.ToString();
                            break;
                    }
                }

                await _userContext.UpdateAsync(user, useNavigationalProperties);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email is required");
            }
            try
            {
                await _userContext.DeleteAsync(request.Email);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        [Route("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] Dictionary<string, object> data)
        {
            try
            {
                string email = data["email"].ToString();
                User user = await _userContext.ReadAsync(email, true, false);
                if (user == null) return NotFound("User not found");
                return Ok("User exists");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("follow")]
        public async Task<IActionResult> FollowUser([FromBody] Dictionary<string, int> data)
        {
            try
            {
                int followerId = data["followerId"];
                int followingId = data["followingId"];

                var follower = await _userContext.GetUserByIdAsync(followerId);
                var userToFollow = await _userContext.GetUserByIdAsync(followingId);

                if (follower == null || userToFollow == null)
                {
                    return NotFound("User not found");
                }

                follower.FollowingIds ??= new List<int>();
                userToFollow.FollowerIds ??= new List<int>();

                if (follower.FollowingIds.Contains(followingId))
                {
                    return BadRequest("Already following this user");
                }

                follower.FollowingIds.Add(followingId);
                userToFollow.FollowerIds.Add(followerId);

                await _userContext.UpdateAsync(follower, false);
                await _userContext.UpdateAsync(userToFollow, false);

                return Ok(new
                {
                    follower.FollowingIds,
                    userToFollow.FollowerIds
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("unfollow")]
        public async Task<IActionResult> UnfollowUser([FromBody] Dictionary<string, int> data)
        {
            try
            {
                int followerId = data["followerId"];
                int followingId = data["followingId"];

                var follower = await _userContext.GetUserByIdAsync(followerId);
                var userToUnfollow = await _userContext.GetUserByIdAsync(followingId);

                if (follower == null || userToUnfollow == null)
                {
                    return NotFound("User not found");
                }

                follower.FollowingIds ??= new List<int>();
                userToUnfollow.FollowerIds ??= new List<int>();

                if (!follower.FollowingIds.Contains(followingId))
                {
                    return BadRequest("Not following this user");
                }


                follower.FollowingIds.Remove(followingId);
                userToUnfollow.FollowerIds.Remove(followerId);


                await _userContext.UpdateAsync(follower, false);
                await _userContext.UpdateAsync(userToUnfollow,false);

                return Ok(new
                {
                    follower.FollowingIds,
                    userToUnfollow.FollowerIds
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
