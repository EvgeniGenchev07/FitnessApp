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

    public async Task<User> ReadAsync(string key)
    {
        try
        {
            User user = await _dbContext.Users.Include(u => u.Workouts)
                .Include(u => u.Meals)
                .Include(u => u.Measurements)
                .Include(u => u.Schedule)
                .FirstOrDefaultAsync(u => u.Email == key);
            return user;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(User entity)
    {
        try
        {
            _dbContext.Users.Update(entity);
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
            User user = await ReadAsync(key);

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
