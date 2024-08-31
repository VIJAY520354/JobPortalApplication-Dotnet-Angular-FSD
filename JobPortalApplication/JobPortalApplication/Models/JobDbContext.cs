using JobPortalApplication.Models;
using Microsoft.EntityFrameworkCore;

public class JobDbContext : DbContext
{
    public JobDbContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Profile> Profiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //unique key to rrid
        modelBuilder.Entity<Job>()
           .HasIndex(j => j.RRID)
           .IsUnique();
        //unique key to email
        modelBuilder.Entity<User>()
               .HasIndex(u => u.Email)
               .IsUnique();
        // User - Job (One to Many)
        modelBuilder.Entity<Job>()
            .HasOne(j => j.User)
            .WithMany(u => u.Jobs)
            .HasForeignKey(j => j.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // User - Profile (One to Many)
        modelBuilder.Entity<Profile>()
            .HasOne(p => p.User)
            .WithMany(u => u.Profiles)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Job - Profile (One to Many)
        modelBuilder.Entity<Profile>()
            .HasOne(p => p.Job)
            .WithMany(j => j.Profiles)
            .HasForeignKey(p => p.JobId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(modelBuilder);
    }
}
