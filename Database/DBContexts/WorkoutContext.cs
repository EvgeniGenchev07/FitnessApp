using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class WorkoutContext: IDatabase<Workout, int>
{
    private readonly AthloboostDbContext _dbContext;
    public WorkoutContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Workout entity)
    {
        throw new NotImplementedException();
    }

    public async Task<Workout> ReadAsync(int key)
    {
        try
        {
            Workout workout = await _dbContext.Workouts.Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise)
                .FirstOrDefaultAsync(w => w.Id == key);
            return workout;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Workout entity)
    {
        try
        {
            _dbContext.Workouts.Update(entity);
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
            Workout workout = await _dbContext.Workouts.Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Sets)
                .FirstOrDefaultAsync(w => w.Id == key);
            if (workout != null)
            {
                _dbContext.Sets.RemoveRange(workout.WorkoutExercises.SelectMany(we => we.Sets));
                _dbContext.WorkoutExercises.RemoveRange(workout.WorkoutExercises);
                _dbContext.Workouts.Remove(workout);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
