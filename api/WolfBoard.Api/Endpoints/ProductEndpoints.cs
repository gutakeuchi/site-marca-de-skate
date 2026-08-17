using Microsoft.EntityFrameworkCore;
using WolfBoard.Api.Data;
using WolfBoard.Api.Dtos;

namespace WolfBoard.Api.Endpoints;

public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api").WithTags("Catalog");

        group.MapGet("/categories", async (AppDbContext db) =>
        {
            var items = await db.Categories
                .AsNoTracking()
                .OrderBy(category => category.Group)
                .ThenBy(category => category.Title)
                .Select(category => new CategoryDto(category.Slug, category.Title, category.Group))
                .ToListAsync();

            return Results.Ok(items);
        });

        group.MapGet("/products", async (
            AppDbContext db,
            string? category,
            string? q,
            int? skip,
            int? take) =>
        {
            var query = db.Products.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(product => product.CategorySlug == category);
            }

            if (!string.IsNullOrWhiteSpace(q))
            {
                var term = q.Trim().ToLower();
                query = query.Where(product => product.Name.ToLower().Contains(term));
            }

            var total = await query.CountAsync();
            var pageSize = Math.Clamp(take ?? 100, 1, 200);
            var offset = Math.Max(skip ?? 0, 0);

            var items = await query
                .OrderBy(product => product.Id)
                .Skip(offset)
                .Take(pageSize)
                .Select(product => new ProductDto(
                    product.Id,
                    product.Name,
                    product.Price,
                    product.Image,
                    product.CategorySlug))
                .ToListAsync();

            return Results.Ok(new ProductListResponse(items, total));
        });

        group.MapGet("/products/{id:int}", async (int id, AppDbContext db) =>
        {
            var product = await db.Products
                .AsNoTracking()
                .Where(item => item.Id == id)
                .Select(item => new ProductDto(
                    item.Id,
                    item.Name,
                    item.Price,
                    item.Image,
                    item.CategorySlug))
                .FirstOrDefaultAsync();

            return product is null ? Results.NotFound() : Results.Ok(product);
        });

        return group;
    }
}
