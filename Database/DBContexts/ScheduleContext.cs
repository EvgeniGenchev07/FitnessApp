using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class ScheduleContext : IDatabase<Schedule, int>
{
    private readonly AthloboostDbContext _dbContext;

    public ScheduleContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Schedule entity)
    {
        await _dbContext.Schedules.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Schedule> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Schedule> query = _dbContext.Schedules;
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        if (useNavigationalProperties)
            query = query
                .Include(s => s.Workouts);
        Schedule schedule = await query.FirstOrDefaultAsync(e => e.UserId == key);
        return schedule;
    }

    public async Task UpdateAsync(Schedule entity, bool useNavigationalProperties)
    {
        Schedule scheduleFromDb = await ReadAsync(entity.UserId, useNavigationalProperties);
        if (useNavigationalProperties)
        {
            scheduleFromDb.RestDays = entity.RestDays;
            scheduleFromDb.Workouts = entity.Workouts;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Schedule schedule = await ReadAsync(key, false);
        if (schedule != null)
        {
            _dbContext.Schedules.Remove(schedule);
            await _dbContext.SaveChangesAsync();
        }
    }
}
