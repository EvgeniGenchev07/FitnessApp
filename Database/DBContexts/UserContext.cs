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
                .ThenInclude(w=>w.Exercises)
                .ThenInclude(e=>e.Sets)
                .Include(u => u.Meals)
                .Include(u => u.Measurements)
                .Include(u => u.Schedule)
                .Include(u => u.Foods)
                .Include(u => u.Exercises)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Posts)
                .ThenInclude(p => p.Comments);
                
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        User user = await query.FirstOrDefaultAsync(u => u.Email == key);
        return user;
    }

    public async Task UpdateAsync(User entity, bool navigationalProperties)
    {
        User userFromDb = await ReadAsync(entity.Email, navigationalProperties, false);
        if (userFromDb == null) return;

        userFromDb.UserName = entity.UserName;
        userFromDb.Email = entity.Email;
        userFromDb.Weight = entity.Weight;
        userFromDb.WeightGoal = entity.WeightGoal;
        userFromDb.Height = entity.Height;
        userFromDb.Password = entity.Password;
        userFromDb.Facebook = entity.Facebook;
        userFromDb.Instagram = entity.Instagram;
        userFromDb.X = entity.X;
        userFromDb.Bio = entity.Bio;
        userFromDb.Followers = entity.Followers;
        userFromDb.Following = entity.Following;
        userFromDb.Bio = entity.Bio;

        if (navigationalProperties)
        {
            // Clear existing collections before updating
            if (entity.Meals != null)
            {
                userFromDb.Meals.Clear();
                userFromDb.Meals = entity.Meals;
            }
            if (entity.Measurements != null)
            {
                userFromDb.Measurements.Clear();
                userFromDb.Measurements = entity.Measurements;
            }
            if (entity.Schedule != null)
            {
                userFromDb.Schedule = entity.Schedule;
            }
            if (entity.Workouts != null)
            {
                userFromDb.Workouts.Clear();
                userFromDb.Workouts = entity.Workouts;
            }
            if (entity.Foods != null)
            {
                userFromDb.Foods.Clear();
                userFromDb.Foods = entity.Foods;
            }
            if (entity.Exercises != null)
            {
                userFromDb.Exercises.Clear();
                userFromDb.Exercises = entity.Exercises;
            }
            if (entity.Followers != null)
            {
                userFromDb.Followers.Clear();
                userFromDb.Followers = entity.Followers;
            }
            if (entity.Following != null)
            {
                userFromDb.Following.Clear();
                userFromDb.Following = entity.Following;
            }
            if (entity.Posts != null)
            {
                userFromDb.Posts.Clear();
                userFromDb.Posts = entity.Posts;
            }
        }

        if (entity.Photo != null)
        {
            userFromDb.Photo = entity.Photo;
        }

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // If we get a concurrency exception, reload the entity and try again
            _dbContext.Entry(userFromDb).State = EntityState.Detached;
            userFromDb = await ReadAsync(entity.Email, navigationalProperties, false);
            if (userFromDb != null)
            {
                await UpdateAsync(entity, navigationalProperties);
            }
        }
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
