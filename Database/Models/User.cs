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
<<<<<<< HEAD
        ///public Dictionary<DateTime, Measurement>  Measurements{get ; set;}
        public List<Measurement> Measurements { get; set; }
=======
        public List<Measurement> Measurements{get ; set;}
>>>>>>> 1471b597b789dad0fa7a01816a238a10f7e5a7be
        public List<Workout> Workouts { get; set;}
        public List<Meal> Meals { get; set;}
        [NotMapped]
        public Schedule Schedule { get; set; }
        public byte Height { get; set; }

    }
}
