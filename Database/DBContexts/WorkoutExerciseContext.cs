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
        Exercise exerciseFromDb = await _dbContext.Exercises.FindAsync(entity.ExerciseId);
        if (exerciseFromDb is not null) entity.Exercise = exerciseFromDb;
        await _dbContext.WorkoutExercises.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<WorkoutExercise> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<WorkoutExercise> query = _dbContext.WorkoutExercises;
        if (useNavigationalProperties) query = query.Include(w => w.Exercise);
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        WorkoutExercise workoutExercise = await query.FirstOrDefaultAsync(w => w.Id == key);
        return workoutExercise;
    }

    public async Task UpdateAsync(WorkoutExercise entity, bool useNavigationalProperties)
    {
        WorkoutExercise workoutExerciseFromDb = await ReadAsync(entity.Id, useNavigationalProperties);
        if (useNavigationalProperties)
        {
            workoutExerciseFromDb.Sets = entity.Sets;
            workoutExerciseFromDb.Exercise = entity.Exercise;
            workoutExerciseFromDb.ExerciseId = workoutExerciseFromDb.Exercise.Id;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        WorkoutExercise workoutExercise = await ReadAsync(key, true);
        if (workoutExercise != null)
        {
            _dbContext.Sets.RemoveRange(workoutExercise.Sets);
            _dbContext.WorkoutExercises.Remove(workoutExercise);
            await _dbContext.SaveChangesAsync();
        }
    }
}
