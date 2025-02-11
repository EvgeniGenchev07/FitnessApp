using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
    [Table("Schedules")]
    [PrimaryKey("Id")]
    public class Schedule
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        List<Workout> Workouts { get; set; }
        List<byte> RestDays { get; set; }
        public User User { get; set; }
    }
}
