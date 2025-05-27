using Microsoft.AspNetCore.Mvc;
using Models;
using DBContexts;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Razor;
using Newtonsoft.Json;
using System.Text.Json;
using System.IO;

[ApiController]
[Route("posts/")]
[EnableCors("Disable cross-origin")]
public class PostsController : ControllerBase
{
    private readonly PostContext _postContext;
    private readonly AthloboostDbContext _dbContext;
    private const long MaxFileSize = 10 * 1024 * 1024;

    public PostsController(PostContext postContext,AthloboostDbContext dbContext)
    {
        _postContext = postContext;
        _dbContext = dbContext;
    }

    [HttpPost]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> CreatePost(
    [FromForm] string title,
    [FromForm] string description,
    [FromForm] IFormFile photo,
    [FromForm] int userId,
    [FromForm] string language)
    {
        try
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var post = new Post
            {
                Title = title,
                Description = description,
                Created = DateTime.UtcNow,
                Language=language,
                Likes = 0,
                User = user
            };

            if (photo != null)
            {
                using var memoryStream = new MemoryStream();
                await photo.CopyToAsync(memoryStream);
                post.Photo = memoryStream.ToArray();
                post.PhotoMimeType = photo.ContentType;
            }

            await _postContext.CreateAsync(post);

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, new
            {
                post.Id,
                post.Title,
                User = new { post.User.Id }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(int id, [FromQuery] bool includeComments = false)
    {
        try
        {
            var post = await _postContext.ReadAsync(id, includeComments, true);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Description,
                post.Created,
                post.Likes,
                post.Language,
                post.Photo,
                post.PhotoMimeType,
                User = post.User != null ? new { post.User.Id, post.User.UserName } : null,
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}/photo")]
    public async Task<IActionResult> GetPostPhoto(int id)
    {
        try
        {
            var post = await _postContext.ReadAsync(id, false, true);

            if (post?.Photo == null)
            {
                return NotFound();
            }

            return File(post.Photo, post.PhotoMimeType ?? "application/octet-stream");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> UpdatePost(
        int id,
        [FromForm] string title,
        [FromForm] string description,
        [FromForm] IFormFile photo,
        [FromForm] int? userId,
        [FromQuery] bool updateComments = false)
    {
        try
        {
            var existingPost = await _postContext.ReadAsync(id, updateComments, false);
            if (existingPost == null)
            {
                return NotFound();
            }

            existingPost.Title = title;
            existingPost.Description = description;


            if (userId.HasValue)
            {
                var userProxyPost = await _postContext.ReadAsync(userId.Value, true, false);
                if (userProxyPost?.User == null)
                {
                    return BadRequest("User not found");
                }
                existingPost.User = userProxyPost.User;
            }

            if (photo != null)
            {
                using var memoryStream = new MemoryStream();
                await photo.CopyToAsync(memoryStream);
                existingPost.Photo = memoryStream.ToArray();
                existingPost.PhotoMimeType = photo.ContentType;
            }

            await _postContext.UpdateAsync(existingPost, updateComments);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            var post = await _postContext.ReadAsync(id, true);

            if (post == null)
            {
                return NotFound();
            }

            var user = await _dbContext.Users
                .Include(u => u.Posts)
                .FirstOrDefaultAsync(u => u.Id == post.User.Id);

            if (user == null)
            {
                return NotFound("User not found");
            }
            user.Posts.Remove(post);
            await _postContext.DeleteAsync(id);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpGet]
    [Route("all")]
    [EnableCors("Disable cross-origin")]
    public async Task<IActionResult> GetAllPosts()
    {
        try
        {
            var postsQuery = _dbContext.Posts
                .Include(p => p.User)
                .AsQueryable();


            var result = await postsQuery
                .OrderByDescending(p => p.Created) 
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Created,
                    p.Likes,
                    p.Photo,
                    p.Language,
                    p.PhotoMimeType,
                    Avatar = p.User.Photo,
                    User = p.User != null ? new { p.User.Id, p.User.UserName } : null,
                })
                .ToListAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet]
    [Route("search/{query}")]
    public async Task<IActionResult> SearchPosts(string query)
    {
        try
        {
            var postsQuery = _dbContext.Posts
                .Include(p => p.User)
                .AsQueryable();


            var result = await postsQuery
                .Where(p => p.Description.ToLower().Contains(query.ToLower())) 
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.Created,
                    p.Likes,
                    p.Photo,
                    p.Language,
                    p.PhotoMimeType,
                    Avatar = p.User.Photo,
                    User = p.User != null ? new { p.User.Id, p.User.UserName } : null
                })
                .ToListAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("{postId}/like")]
    public async Task<IActionResult> LikePost(int postId, [FromQuery] int userId)
    {
        try
        {
            var post = await _postContext.ReadAsync(postId, false, false);
            if (post == null) return NotFound("Post not found");

            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return BadRequest("User not found");

            var existingLike = await _dbContext.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            if (existingLike == null)
            {
                var like = new Like { PostId = postId, UserId = userId };
                _dbContext.Likes.Add(like);
                post.Likes++;
                await _postContext.UpdateAsync(post, false);
                await _dbContext.SaveChangesAsync();
                return Ok(new { Likes = post.Likes, Liked = true });
            }
            else
            {
                _dbContext.Likes.Remove(existingLike);
                post.Likes--;
                await _postContext.UpdateAsync(post, false);
                await _dbContext.SaveChangesAsync();
                return Ok(new { Likes = post.Likes, Liked = false });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpGet("{postId}/check-like")]
    public async Task<IActionResult> CheckIfLiked(int postId, [FromQuery] int userId)
    {
        try
        {
            var like = await _dbContext.Likes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.UserId == userId);

            return Ok(new { liked = like != null });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
