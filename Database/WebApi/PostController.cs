using Microsoft.AspNetCore.Mvc;
using Models;
using DBContexts;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;

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
    [FromForm] int userId)
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
                User = post.User != null ? new { post.User.Id } : null,
                Comments = includeComments && post.Comments != null
                    ? post.Comments.Select(c => new
                    {
                        c.Id,
                        c.Description,
                        c.CreatedAt,
                        UserId = c.UserID
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
}