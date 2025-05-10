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
            query = query.Include(p => p.Comments);
            // No User navigation property to include
        }

        if (isReadOnly)
        {
            query = query.AsNoTrackingWithIdentityResolution();
        }

        return await query.FirstOrDefaultAsync(p => p.Id == key);
    }

    public async Task UpdateAsync(Post entity, bool navigationalProperties)
    {
        Post postFromDb = await ReadAsync(entity.Id, navigationalProperties, false);
        if (postFromDb == null) return;

        postFromDb.Description = entity.Description;
        postFromDb.Title = entity.Title;
        postFromDb.Likes = entity.Likes;
        postFromDb.Created = entity.Created;
        postFromDb.UserID = entity.UserID; // Update the UserID

        if (navigationalProperties && entity.Comments != null)
        {
            postFromDb.Comments.Clear();
            postFromDb.Comments = entity.Comments;
        }

        if (entity.Photo != null)
        {
            postFromDb.Photo = entity.Photo;
        }

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // If we get a concurrency exception, reload the entity and try again
            _dbContext.Entry(postFromDb).State = EntityState.Detached;
            postFromDb = await ReadAsync(entity.Id, navigationalProperties, false);
            if (postFromDb != null)
            {
                await UpdateAsync(entity, navigationalProperties);
            }
        }
    }

    public async Task DeleteAsync(int key)
    {
        Post post = await ReadAsync(key, true, false);

        if (post != null)
        {
            // Remove all comments associated with this post
            _dbContext.Comments.RemoveRange(post.Comments);

            // Remove the post itself
            _dbContext.Posts.Remove(post);

            await _dbContext.SaveChangesAsync();
        }
    }
}