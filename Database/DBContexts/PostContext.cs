using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts;

public class PostContext : IDatabase<Post, int>
{
    private readonly AthloboostDbContext _dbContext;

    public PostContext(AthloboostDbContext context)
    {
        _dbContext = context;
    }

    public async Task CreateAsync(Post entity)
    {
        await _dbContext.Posts.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Post> ReadAsync(int key, bool useNavigationalProperties, bool isReadOnly = false)
    {
        IQueryable<Post> query = _dbContext.Posts;

        if (useNavigationalProperties)
        {
            query = query.Include(p => p.Comments)
                         .Include(p => p.User);
        }

        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }

        return await query.FirstOrDefaultAsync(p => p.Id == key);
    }

    public async Task UpdateAsync(Post entity, bool navigationalProperties)
    {
        var existingPost = await ReadAsync(entity.Id, navigationalProperties, false);
        if (existingPost == null) return;

        existingPost.Description = entity.Description;
        existingPost.Title = entity.Title;
        existingPost.Likes = entity.Likes;
        existingPost.Created = entity.Created;

        if (entity.Photo != null)
        {
            existingPost.Photo = entity.Photo;
            existingPost.PhotoMimeType = entity.PhotoMimeType;
        }

        if (navigationalProperties)
        {
            if (entity.Comments != null)
            {
                _dbContext.Comments.RemoveRange(existingPost.Comments ?? []);
                existingPost.Comments = entity.Comments;
            }

            if (entity.User != null)
            {
                existingPost.User = entity.User;
            }
        }

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            await _dbContext.Entry(existingPost).ReloadAsync();
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(int key)
    {
        var post = await ReadAsync(key, true);

        if (post != null)
        {
            if (post.Comments != null)
                _dbContext.Comments.RemoveRange(post.Comments);

            _dbContext.Posts.Remove(post);
            await _dbContext.SaveChangesAsync();
        }
    }
}
