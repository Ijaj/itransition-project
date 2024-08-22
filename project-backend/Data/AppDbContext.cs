using Microsoft.EntityFrameworkCore;
using project_backend.Models;

namespace project_backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<CustomField> CustomFields { get; set; }
        public DbSet<CustomFieldValue> CustomFieldsValues { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemImage> ItemsImages { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow;

                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).CreatedAt = now;
                }

                ((BaseEntity)entity.Entity).UpdatedAt = now;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Item>()
            .HasMany(i => i.Tags)
            .WithMany(t => t.Items)
            .UsingEntity(j => j.ToTable("ItemTags"));

            modelBuilder.Entity<Item>()
            .HasMany(i => i.CustomFieldValues)
            .WithOne(c => c.Item)
            .HasForeignKey(i => i.ItemId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Item>()
            .HasMany(i => i.Images)
            .WithOne(i => i.Item)
            .HasForeignKey(i => i.ItemId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Collection>()
            .HasMany(c => c.CustomFields)
            .WithOne(cf => cf.Collection)
            .HasForeignKey(i => i.CollectionId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Collection>()
            .HasMany(c => c.Items)
            .WithOne(i => i.Collection)
            .HasForeignKey(i => i.CollectionId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
            .HasMany(u => u.Collections)
            .WithOne(u => u.User)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<CustomField>()
            .HasMany(cf => cf.CustomFieldValues)
            .WithOne(cf => cf.CustomField)
            .HasForeignKey(cf => cf.CustomFieldId)
            .OnDelete(DeleteBehavior.NoAction);
        }
    }
}