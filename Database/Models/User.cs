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
        [RegularExpression(@"^[A-Za-zА-Яа-я0-9_\-. ]{3,16}$",
    ErrorMessage = "Only letters (Latin,Cyrilic), numbers, dashes, dots, and spaces are allowed.")]
        public string UserName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Password { get; set; }

        [Required]
        [MaxLength(50)]
        [EmailAddress]
        public string Email { get; set; }

        public DateTime CreationDate { get; init; }

        public List<Workout> Workouts { get; set;}

        public List<Meal> Meals { get; set;}

        public List<Exercise> Exercises { get; set; }

        public Schedule Schedule { get; set; }

        public byte Weight { get; set; }

        [Range(50, 255)]    
        public byte? Height { get; set; }

        [Url]
        public string Facebook { get; set; }

        [Url]
        public string Instagram { get; set; }

        [Url] 
        public string X { get; set; }
        public byte[] Photo { get; set; }
        
        public List<User> Followers { get; set; }
        public List<User> Following { get; set; }
        public List<Post> Posts { get; set; }
        public string Bio { get; set; }
        public string PhotoMimeType { get; set; }
    }
}
