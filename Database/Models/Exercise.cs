using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Exercises")]
    [PrimaryKey("Id")]
    public class Exercise
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        public List<MuscleGroups> MuscleGroups { get; set; }
    }

}
