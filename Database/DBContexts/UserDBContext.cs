using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class UserDBContext : DbContext
    {
        public DbSet<User> User { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
