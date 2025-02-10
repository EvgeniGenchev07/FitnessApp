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
    [Table("Foods")]
    [PrimaryKey("Id")]
    public class Food
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }
        [Required]
        public ushort Calories { get; set; }
        [Required]
        public ushort Carbs { get; set; }
        [Required]
        public ushort Fats { get; set; }
        [Required]
        public ushort Proteins { get; set; }
    }
}
