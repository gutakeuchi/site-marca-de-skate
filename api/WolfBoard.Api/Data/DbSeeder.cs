using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using WolfBoard.Api.Models;

namespace WolfBoard.Api.Data;

public static class DbSeeder
{
    private static readonly string[] AllowedEmails =
    [
        "vitor.silva1048@etec.sp.gov.br",
        "gustavo.takeuchi@etec.sp.gov.br",
        "gabriel.ferreira428@etec.sp.gov.br",
        "gustavo.azevedo11@etec.sp.gov.br",
    ];

    private const string DemoPassword = "admin";

    public static async Task SeedAsync(AppDbContext db, IHostEnvironment env)
    {
        await db.Database.MigrateAsync();

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        };

        if (!await db.Categories.AnyAsync())
        {
            var categoriesPath = Path.Combine(env.ContentRootPath, "Data", "seed-categories.json");
            var categoriesJson = await File.ReadAllTextAsync(categoriesPath);
            var categories = JsonSerializer.Deserialize<List<SeedCategory>>(categoriesJson, jsonOptions)
                ?? [];

            db.Categories.AddRange(categories.Select(category => new Category
            {
                Slug = category.Slug,
                Title = category.Title,
                Group = category.Group,
            }));
            await db.SaveChangesAsync();
        }

        if (!await db.Products.AnyAsync())
        {
            var productsPath = Path.Combine(env.ContentRootPath, "Data", "seed-products.json");
            var productsJson = await File.ReadAllTextAsync(productsPath);
            var products = JsonSerializer.Deserialize<List<SeedProduct>>(productsJson, jsonOptions)
                ?? [];

            db.Products.AddRange(products.Select(product => new Product
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Image = product.Image,
                CategorySlug = product.Category,
            }));
            await db.SaveChangesAsync();
        }

        if (!await db.Users.AnyAsync())
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(DemoPassword);
            foreach (var email in AllowedEmails)
            {
                db.Users.Add(new User
                {
                    Email = email.ToLowerInvariant(),
                    PasswordHash = passwordHash,
                });
            }

            await db.SaveChangesAsync();
        }
    }

    private sealed record SeedCategory(string Slug, string Title, string Group);

    private sealed record SeedProduct(int Id, string Name, decimal Price, string Image, string Category);
}
