using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class ExerciseContext : IDatabase<Exercise, int>
{
    private readonly AthloboostDbContext _dbContext;

    public ExerciseContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Exercise entity)
    {
        await _dbContext.Exercises.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Exercise> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Exercise> query = _dbContext.Exercises;
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Exercise exercise = await query.FirstOrDefaultAsync(e => e.Id == key);
        return exercise;
    }

    public async Task UpdateAsync(Exercise entity, bool useNavigationalProperties)
    {
        Exercise exercise = await ReadAsync(entity.Id, useNavigationalProperties);
        exercise.Name = entity.Name;
        if (useNavigationalProperties)
        {
            exercise.MuscleGroups = entity.MuscleGroups;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Exercise exercise = await ReadAsync(key, false);
        if (exercise != null)
        {
            _dbContext.Exercises.Remove(exercise);
            await _dbContext.SaveChangesAsync();
        }
    }
}
