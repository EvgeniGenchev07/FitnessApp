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

    public async Task<Set> ReadAsync(int key)
    {
        try
        {
            Set set = await _dbContext.Sets.FirstOrDefaultAsync(s => s.Id == key);
            return set;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(Set entity)
    {
        try
        {
            _dbContext.Sets.Update(entity);
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
            Set set = await ReadAsync(key);
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
