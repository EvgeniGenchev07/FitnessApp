using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Post
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Description { get; set; }
    public string Title { get; set; }
    public int UserID { get; set; }
    public DateTime Created { get; set; }
    public int Likes { get; set; }
    public byte[] Photo { get; set; }
    public List<Comment> Comments { get; set; }
}
