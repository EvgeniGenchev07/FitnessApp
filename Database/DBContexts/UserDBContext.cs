using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class UserDBContext : DbContext
    {
        public DbSet<User> User { get; set; }

        //public UserDBContext(DbContextOptions<UserDBContext> options) : base(options) { }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseMySQL("server=localhost;database=athloboostx;user=root;password=evgeni");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(s => s.Meals)
                .WithOne();
            modelBuilder.Entity<User>()
                .HasMany(s => s.Workouts)
                .WithOne();
            modelBuilder.Entity<User>()
                .HasMany(s => s.Measurements)
                .WithOne();
            base.OnModelCreating(modelBuilder);
        }
    }
}
