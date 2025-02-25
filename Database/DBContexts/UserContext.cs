using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class UserContext : IDatabase<User,string>
{
    private readonly AthloboostDbContext _dbContext;
    public UserContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(User entity)
    {
        try
        {
            _dbContext.Users.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<User> ReadAsync(string key,bool useNavigationalProperties, bool isReadOnly = false)
    {
        try
        {
            IQueryable<User> query = _dbContext.Users;
            if (useNavigationalProperties) query = query
                    .Include(u => u.Workouts)
                    .Include(u => u.Meals)
                    .Include(u => u.Measurements)
                    .Include(u => u.Schedule);
            if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
            User user = await query.FirstOrDefaultAsync(u => u.Email == key);
            return user;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(User entity,bool navigationalProperties = false)
    {
        try
        {
            User userFromDb = await ReadAsync(entity.Email, navigationalProperties,false);
            userFromDb.UserName = entity.UserName;
            userFromDb.Email = entity.Email;
            userFromDb.Age = entity.Age;
            userFromDb.Height = entity.Height;
            userFromDb.Password = entity.Password;
            userFromDb.Meals = entity.Meals;
            userFromDb.Measurements = entity.Measurements;
            userFromDb.Schedule = entity.Schedule;
            userFromDb.Workouts = entity.Workouts;
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task DeleteAsync(string key)
    {
        try
        {
            User user = await ReadAsync(key,false,false);

            if (user != null)
            {
                _dbContext.Workouts.RemoveRange(user.Workouts);
                _dbContext.Meals.RemoveRange(user.Meals);
                _dbContext.Measurements.RemoveRange(user.Measurements);
                if (user.Schedule != null)
                {
                    _dbContext.Schedules.Remove(user.Schedule);
                }

                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
