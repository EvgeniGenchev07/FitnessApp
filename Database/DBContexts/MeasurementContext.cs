using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class MeasurementContext : IDatabase<Measurement, int>
{
    private readonly AthloboostDbContext _dbContext;

    public MeasurementContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(Measurement entity)
    {
        await _dbContext.Measurements.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Measurement> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Measurement> query = _dbContext.Measurements;
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Measurement measurement = await query.FirstOrDefaultAsync(m => m.Id == key);
        return measurement;
    }

    public async Task UpdateAsync(Measurement entity, bool useNavigationalProperties)
    {
        Measurement measurementFromDb = await ReadAsync(entity.Id, useNavigationalProperties);

        measurementFromDb.Arm = entity.Arm;
        measurementFromDb.Weight = entity.Weight;
        measurementFromDb.Calf = entity.Calf;
        measurementFromDb.Chest = entity.Chest;
        measurementFromDb.Date = entity.Date;
        measurementFromDb.Waist = entity.Waist;
        measurementFromDb.Forearm = entity.Forearm;

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Measurement measurement = await ReadAsync(key, false, false);
        if (measurement != null)
        {
            _dbContext.Measurements.Remove(measurement);
            await _dbContext.SaveChangesAsync();
        }
    }
}
