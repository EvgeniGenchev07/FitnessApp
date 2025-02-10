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
    [Table("Sets")]
    [PrimaryKey("Id")]
    public class Set
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public Exercise Exercise { get; set; }
        [Required]
        [Precision(2,5)]
        public double Weight { get; set; }
        [Required]
        public byte Reps { get; set; }

    }
}
