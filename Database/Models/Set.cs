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
        public int Id { get; set; }
        [Required]
        [Precision(2,5)]
        [Range(0.5, 1000)]
        public double Weight { get; set; }
        [Required]
        [Range(1, 255)]
        public byte Reps { get; set; }

    }
}
