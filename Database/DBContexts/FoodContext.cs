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

    public async Task<Food> ReadAsync(int key,bool useNavigationalProperties, bool isReadOnly = false)
    {
        try
        {
            IQueryable<Food> query = _dbContext.Foods;
            if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
            Food food = await query.FirstOrDefaultAsync(f => f.Id == key);
            return food;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Food entity,bool useNavigationalProperties)
    {
        try
        {
            Food foodFromDb = await ReadAsync(entity.Id, useNavigationalProperties);
            foodFromDb.Name = entity.Name;
            foodFromDb.Calories = entity.Calories;
            foodFromDb.Carbs = entity.Carbs;
            foodFromDb.Proteins = entity.Proteins;
            foodFromDb.Fats = entity.Fats;
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
            Food food = await ReadAsync(key,false);
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
