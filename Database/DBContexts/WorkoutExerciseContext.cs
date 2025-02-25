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

    public async Task<WorkoutExercise> ReadAsync(int key,bool useNavigationalProperties, bool isReadOnly = false)
    {
        try
        {
            IQueryable<WorkoutExercise> query = _dbContext.WorkoutExercises;
            if (useNavigationalProperties) query = query.Include(w => w.Exercise);
            if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
            WorkoutExercise workoutExercise = await query.FirstOrDefaultAsync(w => w.Id == key);
            return workoutExercise;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(WorkoutExercise entity,bool useNavigationalProperties)
    {
        try
        {
            WorkoutExercise workoutExerciseFromDb = await ReadAsync(entity.Id,useNavigationalProperties);
            if (useNavigationalProperties)
            {
                workoutExerciseFromDb.Sets = entity.Sets;
                workoutExerciseFromDb.Exercise = entity.Exercise;
                workoutExerciseFromDb.ExerciseId = workoutExerciseFromDb.Exercise.Id;
            }
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
            WorkoutExercise workoutExercise = await ReadAsync(key, true);
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
