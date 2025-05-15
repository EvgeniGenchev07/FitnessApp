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
                User = post.User != null ? new { post.User.Id } : null,
                Comments = includeComments && post.Comments != null
                    ? post.Comments.Select(c => new
                    {
                        c.Id,
                        c.Description,
                        c.CreatedAt
                    })
                    : null
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
                // ! Same here: Replace with actual user loading logic
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

            await _postContext.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
    [HttpGet]
    [EnableCors("Disable cross-origin")]
    public async Task<IActionResult> GetAllPosts([FromQuery] bool includeComments = false)
    {
        try
        {
            var postsQuery = _dbContext.Posts
                .Include(p => p.User)
                .AsQueryable();

            if (includeComments)
            {
                postsQuery = postsQuery.Include(p => p.Comments);
            }

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
                    User = p.User != null ? new { p.User.Id, p.User.UserName } : null,
                    Comments = includeComments ? p.Comments.Select(c => new
                    {
                        c.Id,
                        c.Description,
                        c.CreatedAt,
                        UserId = c.UserID
                    }) : null
                })
                .ToListAsync();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}