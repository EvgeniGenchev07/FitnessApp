using Microsoft.EntityFrameworkCore;
using Models;

namespace DBContexts
{
    public class AthloboostDbContext : DbContext
    {
        internal DbSet<User> Users { get; set; }
        internal DbSet<Workout> Workouts { get; set; }
        internal DbSet<Set> Sets { get; set; }
        internal DbSet<Measurement> Measurements { get; set; }
        internal DbSet<Meal> Meals { get; set; }
        internal DbSet<Food> Foods { get; set; }
        internal DbSet<Exercise> Exercises { get; set; }
        internal DbSet<Schedule> Schedules { get; set; }
        internal DbSet<Comment> Comments { get; set; }
        internal DbSet<Post> Posts { get; set; }

        public AthloboostDbContext() : base()
        {
        }

        public AthloboostDbContext(DbContextOptions<AthloboostDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(user =>
            {
                user.HasOne(u => u.Schedule)
                    .WithOne()
                    .HasForeignKey<Schedule>(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                user.HasIndex(u => u.Email)
                    .IsUnique();
            });

            modelBuilder.Entity<Meal>()
                .HasOne(m => m.Food)
                .WithOne()
                .HasForeignKey<Meal>(m => m.FoodId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Comment>().HasOne<User>(c => c.User).WithMany();
            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=athloboostx.db3");
            }
            base.OnConfiguring(optionsBuilder);
        }
    }
}
