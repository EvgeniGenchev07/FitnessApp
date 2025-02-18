﻿using Microsoft.EntityFrameworkCore;
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
        public List<Workout> Workouts { get; set; }
        [Column("Restdays", TypeName = "varbinary(7)")]
        public List<byte> RestDays { get; set; }
        public User User { get; set; }
        [ForeignKey("UserId")]
        public int UserId { get; set; }
    }
}
