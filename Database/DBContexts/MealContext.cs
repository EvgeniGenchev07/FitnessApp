using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class MealContext : IDatabase<Meal, int>
{
    private readonly AthloboostDbContext _dbContext;

    public MealContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Meal entity)
    {
        Food foodFromDb = await _dbContext.Foods.FindAsync(entity.FoodId);
        if (foodFromDb is not null) entity.Food = foodFromDb;
        await _dbContext.Meals.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Meal> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Meal> query = _dbContext.Meals;
        if (useNavigationalProperties) query.Include(m => m.Food);
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Meal meal = await query.FirstOrDefaultAsync(m => m.Id == key);
        return meal;
    }

    public async Task UpdateAsync(Meal entity, bool useNavigationalProperties)
    {
        Meal mealFromDb = await ReadAsync(entity.Id, useNavigationalProperties);
        mealFromDb.Date = entity.Date;
        mealFromDb.Weight = entity.Weight;
        if (useNavigationalProperties)
        {
            Food foodFromDb = await _dbContext.Foods.FirstOrDefaultAsync(f => f.Id == entity.FoodId);
            if (foodFromDb != null) mealFromDb.Food = foodFromDb;
            else mealFromDb.Food = entity.Food;
            mealFromDb.FoodId = mealFromDb.Food.Id;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Meal meal = await ReadAsync(key, false, false);
        if (meal != null)
        {
            _dbContext.Meals.Remove(meal);
            await _dbContext.SaveChangesAsync();
        }
    }
}
