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
        //[Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; }
        [Required]
        [MaxLength(50)]
        public string Password { get; set; }
        [Required]
        [MaxLength(50)]
        [EmailAddress]
        public string Email { get; set; }
        public int Age { get; set; }
        public Dictionary<DateTime, Measurement>  Measurements{get ; set;}
        public List<Workout> Workouts { get; set;}
        public List<Meal> Meals { get; set;}
        public Schedule Schedule { get; set; }
        public byte Height { get; set; }

    }
}
