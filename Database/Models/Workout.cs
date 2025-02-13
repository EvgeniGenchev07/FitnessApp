using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    [Table("Workouts")]
    [PrimaryKey("Id")]
    public class Workout
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public List<WorkoutExercise> WorkoutExercises { get; set; }
        [Required]
        public User User { get; set; }
    }
}
