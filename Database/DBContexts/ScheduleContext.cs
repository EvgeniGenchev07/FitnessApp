using Microsoft.EntityFrameworkCore;
using Models;
namespace DBContexts;

public class ScheduleContext:IDatabase<Schedule,int>
{
    private readonly AthloboostDbContext _dbContext;
    public ScheduleContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Schedule entity)
    {
        try
        {
            _dbContext.Schedules.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Schedule> ReadAsync(int key,bool useNavigationalProperties, bool isReadOnly = false)
    {
        try
        {
            IQueryable<Schedule> query = _dbContext.Schedules;
            if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
            Schedule schedule = await query.FirstOrDefaultAsync(e => e.Id == key);
            return schedule;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Schedule entity)
    {
        try
        {
            _dbContext.Schedules.Update(entity);
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
            Schedule schedule = await ReadAsync(key);
            if (schedule != null)
            {
                _dbContext.Schedules.Remove(schedule);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
