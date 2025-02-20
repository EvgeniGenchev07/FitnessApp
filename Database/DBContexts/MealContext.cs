using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class MealContext: IDatabase<Meal,int>
{
    private readonly AthloboostDbContext _dbContext;
    public MealContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }
    
    public async Task CreateAsync(Meal entity)
    {
        try
        {
            _dbContext.Meals.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Meal> ReadAsync(int key)
    {
        try
        {
            Meal meal = await _dbContext.Meals.Include(m => m.Food)
                .FirstOrDefaultAsync(m => m.Id == key);
            return meal;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Meal entity)
    {
        try
        {
            _dbContext.Meals.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task DeleteAsync(int key)
    {
        try
        {
            Meal meal = await ReadAsync(key);
            if (meal != null)
            {
                _dbContext.Meals.Remove(meal);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
