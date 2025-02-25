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
        
        //public AthloboostDbContext(): base(){}
        public AthloboostDbContext(DbContextOptions<AthloboostDbContext> options) : base(options) { }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(u =>
            {
                u.HasOne(u => u.Schedule)
                    .WithOne()
                    .HasForeignKey<Schedule>(s => s.UserId);

                u.HasIndex(u => u.Email)
                    .IsUnique();
            });

            modelBuilder.Entity<Meal>()
                .HasOne(m => m.Food)
                .WithOne() 
                .HasForeignKey<Meal>(m => m.FoodId);

            modelBuilder.Entity<WorkoutExercise>(we =>
            {
                we.HasOne(we => we.Exercise)
                    .WithOne()
                    .HasForeignKey<WorkoutExercise>(we => we.ExerciseId);
            });
            base.OnModelCreating(modelBuilder);
        }

        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=athloboostx.db3");
            base.OnConfiguring(optionsBuilder);
        }*/
    }
}
