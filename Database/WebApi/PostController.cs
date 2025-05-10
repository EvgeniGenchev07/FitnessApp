using Microsoft.AspNetCore.Mvc;
using Models;
using DBContexts;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

[ApiController]
[Route("posts/")]
[EnableCors("Disable cross-origin")]
public class PostsController : ControllerBase
{
    private readonly PostContext _postContext;
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public PostsController(PostContext postContext)
    {
        _postContext = postContext;
    }

    // POST: api/posts
    [HttpPost]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> CreatePost([FromForm] string title,
                                             [FromForm] string description,
                                             [FromForm] int userID,
                                             [FromForm] IFormFile photo)
    {
        try
        {
            var post = new Post
            {
                Title = title,
                Description = description,
                UserID = userID,
                Created = DateTime.UtcNow,
                Likes = 0
            };

            if (photo != null)
            {
                using var memoryStream = new MemoryStream();
                await photo.CopyToAsync(memoryStream);
                post.Photo = memoryStream.ToArray();
            }

            await _postContext.CreateAsync(post);
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET: api/posts/5
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

            return Ok(post);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // GET: api/posts/5/photo
    [HttpGet("{id}/photo")]
    public async Task<IActionResult> GetPostPhoto(int id)
    {
        try
        {
            var post = await _postContext.ReadAsync(id, false, true);

            if (post == null || post.Photo == null)
            {
                return NotFound();
            }

            return File(post.Photo, "image/jpeg"); // Adjust content type based on your needs
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // PUT: api/posts/5
    [HttpPut("{id}")]
    [RequestSizeLimit(MaxFileSize)]
    public async Task<IActionResult> UpdatePost(int id,
                                             [FromForm] string title,
                                             [FromForm] string description,
                                             [FromForm] IFormFile photo,
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

            if (photo != null)
            {
                using var memoryStream = new MemoryStream();
                await photo.CopyToAsync(memoryStream);
                existingPost.Photo = memoryStream.ToArray();
            }

            await _postContext.UpdateAsync(existingPost, updateComments);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // DELETE: api/posts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        try
        {
            await _postContext.DeleteAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}