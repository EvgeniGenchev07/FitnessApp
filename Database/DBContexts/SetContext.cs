using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class SetContext : IDatabase<Set,int>
{
    private readonly AthloboostDbContext _dbContext;
    public SetContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(Set entity)
    {
        try
        {
            _dbContext.Sets.Add(entity);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<Set> ReadAsync(int key,bool useNavigationalProperties, bool isReadOnly = false)
    {
        try
        {
            IQueryable<Set> query = _dbContext.Sets;
            if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
            Set set = await query.FirstOrDefaultAsync(s => s.Id == key);
            return set;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Set entity,bool useNavigationalProperties)
    {
        try
        {
            Set setFromDb = await ReadAsync(entity.Id, useNavigationalProperties,false);
            setFromDb.Reps = entity.Reps;
            setFromDb.Weight = entity.Weight;
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
            Set set = await ReadAsync(key,false,false);
            if (set != null)
            {
                _dbContext.Sets.Remove(set);
                await _dbContext.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
