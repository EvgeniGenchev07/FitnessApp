using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Models;

namespace DBContexts;

public class UserContext : IDatabase<User, string>
{
    private readonly AthloboostDbContext _dbContext;

    public UserContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(User entity)
    {
        entity.Password = BCrypt.Net.BCrypt.HashPassword(entity.Password);
        await _dbContext.Users.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User> ReadAsync(string key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<User> query = _dbContext.Users;
        if (useNavigationalProperties)
            query = query
                .Include(u => u.Workouts)
                .Include(u => u.Meals)
                .Include(u => u.Measurements)
                .Include(u => u.Schedule)
                .Include(u => u.Foods)
                .Include(u => u.Exercises)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Posts);
                
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        User user = await query.FirstOrDefaultAsync(u => u.Email == key);
        return user;
    }

    public async Task UpdateAsync(User entity, bool navigationalProperties)
    {
        User userFromDb = await ReadAsync(entity.Email, navigationalProperties, false);
        userFromDb.UserName = entity.UserName;
        userFromDb.Email = entity.Email;
        userFromDb.Weight = entity.Weight;
        userFromDb.WeightGoal = entity.WeightGoal;
        userFromDb.Height = entity.Height;
        userFromDb.Password = entity.Password;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        userFromDb.Facebook = entity.Facebook;
        userFromDb.Instagram = entity.Instagram;
        userFromDb.X = entity.X;
        userFromDb.Bio = entity.Bio;
        userFromDb.Followers = entity.Followers;
        userFromDb.Following = entity.Following;
=======
        userFromDb.Bio = entity.Bio;
>>>>>>> Stashed changes
=======
        userFromDb.Bio = entity.Bio;
>>>>>>> Stashed changes
        if (navigationalProperties)
        {
            userFromDb.Meals = entity.Meals;
            userFromDb.Measurements = entity.Measurements;
            userFromDb.Schedule = entity.Schedule;
            userFromDb.Workouts = entity.Workouts;
            userFromDb.Foods = entity.Foods;
            userFromDb.Exercises = entity.Exercises;
            userFromDb.Followers = entity.Followers;
            userFromDb.Following = entity.Following;
            userFromDb.Posts = entity.Posts;
        }
        if (entity.Photo != null)
        {
            userFromDb.Photo = entity.Photo;
        }
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(string key)
    {
        User user = await ReadAsync(key, true, false);

        if (user != null)
        {
            _dbContext.Workouts.RemoveRange(user.Workouts);
            _dbContext.Meals.RemoveRange(user.Meals);
            _dbContext.Measurements.RemoveRange(user.Measurements);
            /*if (user.Schedule != null)
            {
                _dbContext.Schedules.Remove(user.Schedule);
            }*/

            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}
