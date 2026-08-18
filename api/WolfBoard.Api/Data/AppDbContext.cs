using Microsoft.EntityFrameworkCore;
using WolfBoard.Api.Models;

namespace WolfBoard.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(256).IsRequired();
            entity.Property(user => user.PasswordHash).IsRequired();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(category => category.Slug);
            entity.Property(category => category.Slug).HasMaxLength(64);
            entity.Property(category => category.Title).HasMaxLength(128).IsRequired();
            entity.Property(category => category.Group).HasMaxLength(64).IsRequired();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(product => product.Id).ValueGeneratedNever();
            entity.Property(product => product.Name).HasMaxLength(256).IsRequired();
            entity.Property(product => product.Image).HasMaxLength(512).IsRequired();
            entity.Property(product => product.Price).HasPrecision(10, 2);
            entity.HasOne(product => product.Category)
                .WithMany(category => category.Products)
                .HasForeignKey(product => product.CategorySlug)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(product => product.CategorySlug);
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasIndex(cart => cart.UserId).IsUnique();
            entity.HasOne(cart => cart.User)
                .WithOne(user => user.Cart)
                .HasForeignKey<Cart>(cart => cart.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.Property(item => item.Size).HasMaxLength(32).IsRequired();
            entity.HasIndex(item => new { item.CartId, item.ProductId, item.Size }).IsUnique();
            entity.HasOne(item => item.Cart)
                .WithMany(cart => cart.Items)
                .HasForeignKey(item => item.CartId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
