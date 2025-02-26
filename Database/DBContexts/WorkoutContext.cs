using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class WorkoutContext : IDatabase<Workout, int>
{
    private readonly AthloboostDbContext _dbContext;

    public WorkoutContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Workout entity)
    {
        await _dbContext.Workouts.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Workout> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Workout> query = _dbContext.Workouts;
        if (useNavigationalProperties)
            query = query
                .Include(w => w.WorkoutExercises)
                .ThenInclude(we => we.Exercise);
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Workout workout = await query.FirstOrDefaultAsync(w => w.Id == key);
        return workout;
    }

    public async Task UpdateAsync(Workout entity, bool useNavigationalProperties)
    {
        Workout workoutFromDb = await ReadAsync(entity.Id, useNavigationalProperties);
        workoutFromDb.Date = workoutFromDb.Date;
        if (useNavigationalProperties)
        {
            workoutFromDb.WorkoutExercises = workoutFromDb.WorkoutExercises;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Workout workout = await ReadAsync(key, true);
        if (workout != null)
        {
            _dbContext.Sets.RemoveRange(workout.WorkoutExercises.SelectMany(we => we.Sets));
            _dbContext.WorkoutExercises.RemoveRange(workout.WorkoutExercises);
            _dbContext.Workouts.Remove(workout);
            await _dbContext.SaveChangesAsync();
        }
    }
}
