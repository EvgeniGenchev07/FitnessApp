using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class ExerciseContext : IDatabase<Exercise,int>
{
    private readonly AthloboostDbContext _dbContext;
    public ExerciseContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Exercise entity)
    {
        try
        {
            _dbContext.Exercises.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Exercise> ReadAsync(int key)
    {
        try
        {
            Exercise exercise = await _dbContext.Exercises.FirstOrDefaultAsync(e => e.Id == key);
            return exercise;
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Exercise entity)
    {
        try
        {
            _dbContext.Exercises.Update(entity);
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
            Exercise exercise = await ReadAsync(key);
            if (exercise != null)
            {
                _dbContext.Exercises.Remove(exercise);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
