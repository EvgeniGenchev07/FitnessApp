using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class WorkoutExerciseContext : IDatabase<WorkoutExercise, int>
{
    private readonly AthloboostDbContext _dbContext;
    public WorkoutExerciseContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(WorkoutExercise entity)
    {
        try
        {
            _dbContext.WorkoutExercises.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<WorkoutExercise> ReadAsync(int key)
    {
        try
        {
            WorkoutExercise workoutExercise = await _dbContext.WorkoutExercises.Include(w => w.Exercise)
                .FirstOrDefaultAsync(w => w.Id == key);
            return workoutExercise;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(WorkoutExercise entity)
    {
        try
        {
            _dbContext.WorkoutExercises.Update(entity);
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
            WorkoutExercise workoutExercise = await _dbContext.WorkoutExercises.Include(we => we.Sets)
                .FirstOrDefaultAsync(we => we.Id == key);
            if (workoutExercise != null)
            {
                _dbContext.Sets.RemoveRange(workoutExercise.Sets);
                _dbContext.WorkoutExercises.Remove(workoutExercise);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
