using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class AthloboostDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<Set> Sets { get; set; }
        public DbSet<Measurement> Measurements { get; set; }
        public DbSet<Meal> Meals { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
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
            modelBuilder.Entity<User>()
                .HasMany(u => u.Workouts)
                .WithOne(w => w.User)
                .HasForeignKey(w => w.UserId);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Meals)
                .WithOne(m => m.User)
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Measurements)
                .WithOne(m => m.User)
                .HasForeignKey(m => m.UserId);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Schedule>()
                .HasMany(s => s.Workouts)
                .WithOne(w => w.Schedule)
                .HasForeignKey(w => w.ScheduleId);

            modelBuilder.Entity<Meal>()
                .HasOne(m => m.Food)
                .WithOne() 
                .HasForeignKey<Meal>(m => m.FoodId);

            modelBuilder.Entity<Workout>()
                .HasMany(w => w.WorkoutExercises)
                .WithOne(we => we.Workout)
                .HasForeignKey(we => we.WorkoutId);

            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.Exercise)
                .WithOne()
                .HasForeignKey<WorkoutExercise>(we => we.ExerciseId);
            modelBuilder.Entity<WorkoutExercise>()
               .HasMany(we => we.Sets)
               .WithOne(s => s.WorkoutExercise)
               .HasForeignKey(s => s.WorkoutExerciseId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
