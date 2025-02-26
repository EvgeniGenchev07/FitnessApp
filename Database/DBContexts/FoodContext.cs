using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class FoodContext : IDatabase<Food, int>
{
    private readonly AthloboostDbContext _dbContext;

    public FoodContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Food entity)
    {
        await _dbContext.Foods.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Food> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Food> query = _dbContext.Foods;
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Food food = await query.FirstOrDefaultAsync(f => f.Id == key);
        return food;
    }

    public async Task UpdateAsync(Food entity, bool useNavigationalProperties)
    {
        Food foodFromDb = await ReadAsync(entity.Id, useNavigationalProperties);
        foodFromDb.Name = entity.Name;
        foodFromDb.Calories = entity.Calories;
        foodFromDb.Carbs = entity.Carbs;
        foodFromDb.Proteins = entity.Proteins;
        foodFromDb.Fats = entity.Fats;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Food food = await ReadAsync(key, false);
        if (food != null)
        {
            _dbContext.Foods.Remove(food);
            await _dbContext.SaveChangesAsync();
        }
    }
}
