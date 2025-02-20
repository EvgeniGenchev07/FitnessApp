using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class MeasurementContext : IDatabase<Measurement,int>
{
    private readonly AthloboostDbContext _dbContext;
    public MeasurementContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(Measurement entity)
    {
        try
        {
            _dbContext.Measurements.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Measurement> ReadAsync(int key)
    {
        try
        {
            Measurement measurement = await _dbContext.Measurements.FirstOrDefaultAsync(m => m.Id == key);
            return measurement;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Measurement entity)
    {
        try
        {
            _dbContext.Measurements.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch(Exception ex)
        {
            throw ex;
        }
    }

    public async Task DeleteAsync(int key)
    {
        try
        {
            Measurement measurement = await ReadAsync(key);
            if (measurement != null)
            {
                _dbContext.Measurements.Remove(measurement);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
