using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class SetContext : IDatabase<Set, int>
{
    private readonly AthloboostDbContext _dbContext;

    public SetContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }


    public async Task CreateAsync(Set entity)
    {
        await _dbContext.Sets.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Set> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Set> query = _dbContext.Sets;
        if (isReadOnly) query = query.AsNoTrackingWithIdentityResolution();
        Set set = await query.FirstOrDefaultAsync(s => s.Id == key);
        return set;
    }

    public async Task UpdateAsync(Set entity, bool useNavigationalProperties)
    {
        Set setFromDb = await ReadAsync(entity.Id, useNavigationalProperties, false);
        setFromDb.Reps = entity.Reps;
        setFromDb.Weight = entity.Weight;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int key)
    {
        Set set = await ReadAsync(key, false, false);
        if (set != null)
        {
            _dbContext.Sets.Remove(set);
            await _dbContext.SaveChangesAsync();
        }
    }
}
