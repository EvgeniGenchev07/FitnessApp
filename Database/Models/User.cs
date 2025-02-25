using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Users")]
    [PrimaryKey("Id")]
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        [RegularExpression(@"[A-Za-z1-9_\-. ]{3,50}")]
        public string UserName { get; set; }
        [Required]
        [MaxLength(50)]
        [RegularExpression(@"(?=.*[A-Z]+)(?=.*[a-z]+)(?=.*[0-9]+)(?=.*\W+).{8,50}")]
        public string Password { get; set; }
        [Required]
        [MaxLength(50)]
        [EmailAddress]
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public List<Measurement> Measurements { get; set; }
        public List<Workout> Workouts { get; set;}
        public List<Meal> Meals { get; set;}
        public List<Food> Foods { get; set; }
        public List<Exercise> Exercises { get; set; }
        public Schedule Schedule { get; set; }
        [Range(50, 255)]
        public byte Height { get; set; }
    }
}
