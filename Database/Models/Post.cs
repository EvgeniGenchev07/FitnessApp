using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Post
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Description { get; set; }
    public User User { get; set; }
    public DateTime Created { get; set; }
    public int Likes { get; set; }
    [Url]
    public string Url { get; set; }
    public List<Comment> Comments { get; set; }
}
