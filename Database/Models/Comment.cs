using System.ComponentModel.DataAnnotations.Schema;

namespace Models;

public class Comment
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int UserID { get; set; }
    public string Description{ get; set; }
    public int Likes { get; set; }
    public DateTime CreatedAt { get; set; }
}
