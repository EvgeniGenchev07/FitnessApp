using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class AthloboostDbContext : DbContext
    {
        internal DbSet<User> Users { get; set; }
        internal DbSet<Workout> Workouts { get; set; }
        internal DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        internal DbSet<Set> Sets { get; set; }
        internal DbSet<Measurement> Measurements { get; set; }
        internal DbSet<Meal> Meals { get; set; }
        internal DbSet<Food> Foods { get; set; }
        internal DbSet<Exercise> Exercises { get; set; }
        internal DbSet<Schedule> Schedules { get; set; }

        public AthloboostDbContext(DbContextOptions<AthloboostDbContext> options) : base(options) { }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(u =>
            {
                u.HasOne(u => u.Schedule)
                    .WithOne(s => s.User)
                    .HasForeignKey<Schedule>(s => s.UserId);

                u.HasMany(u => u.Workouts)
                    .WithOne(w => w.User)
                    .HasForeignKey(w => w.UserId);

                u.HasMany(u => u.Meals)
                    .WithOne(m => m.User)
                    .HasForeignKey(m => m.UserId);

                u.HasMany(u => u.Measurements)
                    .WithOne(m => m.User)
                    .HasForeignKey(m => m.UserId);

                u.HasIndex(u => u.Email)
                    .IsUnique();
            });
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

            modelBuilder.Entity<WorkoutExercise>(we =>
            {
                we.HasOne(we => we.Exercise)
                    .WithOne()
                    .HasForeignKey<WorkoutExercise>(we => we.ExerciseId);

                we.HasMany(we => we.Sets)
                    .WithOne(s => s.WorkoutExercise)
                    .HasForeignKey(s => s.WorkoutExerciseId);
            });
            base.OnModelCreating(modelBuilder);
        }
    }
}
