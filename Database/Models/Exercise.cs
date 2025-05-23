using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Exercises")]
    [PrimaryKey("Id")]
    public class Exercise
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        [RegularExpression(@"[A-Za-z ]{4,50}")]
        public string Name { get; set; }
        [Required]
        public int EstimatedTime { get; set; }
        public string Level { get; set; }
        public byte[]? Photo { get; set; }
        public string PhotoMimeType { get; set; }
        [Required]
        public List<Set> Sets { get; set; }
    }

}
