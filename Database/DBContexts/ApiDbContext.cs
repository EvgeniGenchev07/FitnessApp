using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class ApiDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Schedule> Schedules { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=athloboostx.db3");
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Schedule)
                .WithOne(s=>s.User)
                .HasForeignKey<Schedule>(s=>s.UserId);
            modelBuilder.Entity<Meal>()
                .HasOne(m => m.Food)
                .WithOne(f=>f.Meal)
                .HasForeignKey<Food>(s=>s.MealId);
            modelBuilder.Entity<WorkoutExercise>()
               .HasOne(we => we.Exercise)
               .WithOne(e => e.WorkoutExercise)
               .HasForeignKey<Exercise>(e => e.WorkoutExerciseId);
            base.OnModelCreating(modelBuilder);
        }
        public void Add(User user)
        {
            Users.Add(user);
            SaveChanges();
        }
    }
}
