namespace DBContexts;

public interface IDatabase<T,K> where T : class
{
    public Task CreateAsync(T entity);
    public Task<T> ReadAsync(K key);
    public Task UpdateAsync(T entity);
    public Task DeleteAsync(K key);
}
