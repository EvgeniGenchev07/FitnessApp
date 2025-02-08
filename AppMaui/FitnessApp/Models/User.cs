using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitnessApp.Models
{
    internal class User
    {
        public int Id { get; private set; }
        public string Name { get; set; }
        public string Email { get; private set; }
        public string Password { get; set; }
        public int Age {  get; set; }
        public User(string name,string email,string password) 
        {
            Name = name;
            Email = email;
            Password = password;
        }
    }
}
