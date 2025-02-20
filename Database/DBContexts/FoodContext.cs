using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class FoodContext:IDatabase<Food, int>
{
    private readonly AthloboostDbContext _dbContext;
    public FoodContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Food entity)
    {
        try
        {
            _dbContext.Foods.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Food> ReadAsync(int key)
    {
        try
        {
            Food food = await _dbContext.Foods.FirstOrDefaultAsync(f => f.Id == key);
            return food;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Food entity)
    {
        try
        {
            _dbContext.Foods.Update(entity);
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
            Food food = await ReadAsync(key);
            if (food != null)
            {
                _dbContext.Foods.Remove(food);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
