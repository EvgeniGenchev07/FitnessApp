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
    [Table("Measurements")]
    [PrimaryKey("Id")]
    public class Measurement
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; } 
        [Precision(2,5)]
        public double Waist { get; set; }
        [Precision(2,5)]
        public double Arm { get; set; }
        [Precision(2, 5)]
        public double Forearm { get; set; }
        [Precision(2,5)]
        public double Calf { get; set; }
        [Precision(2, 5)]
        public double Chest { get; set; }
        [Precision(2,5)]
        public double Weight { get; set; }
        [Required]
        public User User { get; set; }
        public int UserId { get; set; }
    }
}
