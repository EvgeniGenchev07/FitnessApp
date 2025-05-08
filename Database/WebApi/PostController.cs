/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;
using FitnessApp.Database;

namespace FitnessApp.Database.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly AthloboostDbContext _context;

        public PostController(AthloboostDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.PostComments)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return Ok(post);
        }

        [HttpPost]
        public async Task<ActionResult<Post>> CreatePost(Post post)
        {
            post.CreatedAt = DateTime.UtcNow;
            post.Likes = 0;
            post.Comments = 0;
            
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [HttpPost("{id}/like")]
        public async Task<IActionResult> LikePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            post.Likes++;
            await _context.SaveChangesAsync();

            return Ok(new { likes = post.Likes });
        }

        [HttpPost("{id}/comment")]
        public async Task<ActionResult<Comment>> AddComment(int id, Comment comment)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            comment.PostId = id;
            comment.CreatedAt = DateTime.UtcNow;
            
            _context.Comments.Add(comment);
            post.Comments++;
            
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, comment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 
*/
