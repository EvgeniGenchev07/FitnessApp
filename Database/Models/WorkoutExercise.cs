﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    [Table("WorkoutExercises")]
    [PrimaryKey("Id")]
    public class WorkoutExercise
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public Exercise Exercise { get; set; }
        [ForeignKey("ExerciseId")]
        public int ExerciseId { get; set; }
        [Required]
        public List<Set> Sets { get; set; }
        [Required]
        public Workout Workout { get; set; }
        [ForeignKey("WorkoutId")]
        public int WorkoutId { get; set; }
    }
}
