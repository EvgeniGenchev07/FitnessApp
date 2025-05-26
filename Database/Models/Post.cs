using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Post
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
    public DateTime Created { get; set; }
    public List<Like> LikesList { get; set; } = new List<Like>();
    public int Likes { get; set; }
    public byte[] Photo { get; set; }
    public string PhotoMimeType { get; set; } 
    public List<Comment> Comments { get; set; }
    public string Language { get; set; }
    public User User { get; set; }
}
