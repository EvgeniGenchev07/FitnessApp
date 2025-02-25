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
    [Table("Schedules")]
    [PrimaryKey("UserId")]
    public class Schedule
    {
        [ForeignKey("UserId")]      
        public int UserId { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        public List<Workout> Workouts { get; set; }
        [Column("Restdays", TypeName = "varbinary(31)")]
        public List<byte> RestDays { get; set; }
    }
}
