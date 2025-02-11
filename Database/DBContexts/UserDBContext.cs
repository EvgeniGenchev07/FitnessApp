using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class UserDBContext : DbContext
    {
        public DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=athloboostx.db3");
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasOne(u => u.Schedule).WithOne(s=>s.User).HasForeignKey<Schedule>(s=>s.UserId);
            base.OnModelCreating(modelBuilder);
        }
        public void Add(User user)
        {
            User.Add(user);
            SaveChanges();
        }
    }
}
