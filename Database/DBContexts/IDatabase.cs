namespace DBContexts;

public interface IDatabase<T,K> where T : class
{
    public Task CreateAsync(T entity);
    public Task<T> ReadAsync(K key, bool useNavigationalProperties, bool isReadOnly = false);
    public Task UpdateAsync(T entity, bool useNavigationalProperties);
    public Task DeleteAsync(K key);
}
