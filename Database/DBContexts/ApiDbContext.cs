using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class ApiDbContext : DbContext
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

        #region Create
        public void AddUser(User user)
        {
            Users.Add(user);
            SaveChanges();
        }

        public void AddWorkout(Workout workout)
        {
            Workouts.Add(workout);
            SaveChanges();
        }

        public void AddMeal(Meal meal)
        {
            Meals.Add(meal);
            SaveChanges();
        }

        public void AddExercise(Exercise exercise)
        {
            Exercises.Add(exercise);
            SaveChanges();
        }

        public void AddFood(Food food)
        {
            Foods.Add(food);
            SaveChanges();
        }

        public void AddMeasurement(Measurement measurement)
        {
            Measurements.Add(measurement);
            SaveChanges();
        }
        #endregion

        #region Read

        public User GetUserById(int id)
        {
            return Users.Include(u => u.Workouts)
                        .Include(u => u.Meals)
                        .Include(u => u.Measurements)
                        .Include(u => u.Schedule)
                        .FirstOrDefault(u => u.Id == id);
        }

        public Workout GetWorkoutById(int id)
        {
            return Workouts.Include(w => w.WorkoutExercises)
                           .ThenInclude(we => we.Exercise)
                           .FirstOrDefault(w => w.Id == id);
        }

        public Meal GetMealById(int id)
        {
            return Meals.Include(m => m.Food)
                        .FirstOrDefault(m => m.Id == id);
        }

        public Exercise GetExerciseById(int id)
        {
            return Exercises.FirstOrDefault(e => e.Id == id);
        }

        public Food GetFoodById(int id)
        {
            return Foods.FirstOrDefault(f => f.Id == id);
        }

        public Measurement GetMeasurementById(int id)
        {
            return Measurements.FirstOrDefault(m => m.Id == id);
        }
        #endregion

        #region Update

        public void UpdateUser(User user)
        {
            Users.Update(user);
            SaveChanges();
        }

        public void UpdateWorkout(Workout workout)
        {
            Workouts.Update(workout);
            SaveChanges();
        }

        public void UpdateMeal(Meal meal)
        {
            Meals.Update(meal);
            SaveChanges();
        }

        public void UpdateExercise(Exercise exercise)
        {
            Exercises.Update(exercise);
            SaveChanges();
        }

        public void UpdateFood(Food food)
        {
            Foods.Update(food);
            SaveChanges();
        }

        public void UpdateMeasurement(Measurement measurement)
        {
            Measurements.Update(measurement);
            SaveChanges();
        }
        #endregion

        #region Delete

        public void DeleteUser(int id)
        {
            var user = GetUserById(id);

            if (user != null)
            {
                Workouts.RemoveRange(user.Workouts);
                Meals.RemoveRange(user.Meals);
                Measurements.RemoveRange(user.Measurements);
                if (user.Schedule != null)
                {
                    Schedules.Remove(user.Schedule);
                }
                Users.Remove(user);
                SaveChanges();
            }
        }

        public void DeleteWorkoutExercise(int id)
        {
            var workoutExercise = WorkoutExercises.Include(we => we.Sets)
                                                  .FirstOrDefault(we => we.Id == id);
            if (workoutExercise != null)
            {
                Sets.RemoveRange(workoutExercise.Sets);
                WorkoutExercises.Remove(workoutExercise);
                SaveChanges();
            }
        }

        public void DeleteWorkout(int id)
        {
            var workout = Workouts.Include(w => w.WorkoutExercises)
                                  .ThenInclude(we => we.Sets)
                                  .FirstOrDefault(w => w.Id == id);
            if (workout != null)
            {
                Sets.RemoveRange(workout.WorkoutExercises.SelectMany(we => we.Sets));
                WorkoutExercises.RemoveRange(workout.WorkoutExercises);
                Workouts.Remove(workout);
                SaveChanges();
            }
        }
        #endregion
    }
}
