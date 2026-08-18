using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WolfBoard.Api.Data;
using WolfBoard.Api.Dtos;
using WolfBoard.Api.Models;

namespace WolfBoard.Api.Endpoints;

public static class CartEndpoints
{
    public static RouteGroupBuilder MapCartEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/cart")
            .WithTags("Cart")
            .RequireAuthorization();

        group.MapGet("/", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var cart = await GetOrCreateCartAsync(db, userId.Value);
            return Results.Ok(await ToResponseAsync(db, cart.Id));
        });

        group.MapPost("/items", async (
            [FromBody] UpsertCartItemRequest request,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            if (request.Qty < 1)
            {
                return Results.BadRequest(new { message = "Quantidade deve ser pelo menos 1." });
            }

            var product = await db.Products.AsNoTracking()
                .FirstOrDefaultAsync(item => item.Id == request.ProductId);
            if (product is null)
            {
                return Results.NotFound(new { message = "Produto não encontrado." });
            }

            var size = request.Size.Trim();
            if (string.IsNullOrWhiteSpace(size))
            {
                return Results.BadRequest(new { message = "Informe o tamanho." });
            }

            var cart = await GetOrCreateCartAsync(db, userId.Value);
            var existing = await db.CartItems.FirstOrDefaultAsync(item =>
                item.CartId == cart.Id
                && item.ProductId == request.ProductId
                && item.Size == size);

            if (existing is null)
            {
                db.CartItems.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Size = size,
                    Qty = request.Qty,
                });
            }
            else
            {
                existing.Qty += request.Qty;
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok(await ToResponseAsync(db, cart.Id));
        });

        group.MapPut("/items", async (
            [FromBody] UpsertCartItemRequest request,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var cart = await GetOrCreateCartAsync(db, userId.Value);
            var size = request.Size.Trim();
            var item = await db.CartItems.FirstOrDefaultAsync(entry =>
                entry.CartId == cart.Id
                && entry.ProductId == request.ProductId
                && entry.Size == size);

            if (item is null)
            {
                return Results.NotFound(new { message = "Item não está no carrinho." });
            }

            if (request.Qty < 1)
            {
                db.CartItems.Remove(item);
            }
            else
            {
                item.Qty = request.Qty;
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            return Results.Ok(await ToResponseAsync(db, cart.Id));
        });

        group.MapDelete("/items/{productId:int}/{size}", async (
            int productId,
            string size,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var cart = await db.Carts.FirstOrDefaultAsync(entry => entry.UserId == userId.Value);
            if (cart is null) return Results.Ok(EmptyCart());

            var item = await db.CartItems.FirstOrDefaultAsync(entry =>
                entry.CartId == cart.Id
                && entry.ProductId == productId
                && entry.Size == size);

            if (item is not null)
            {
                db.CartItems.Remove(item);
                cart.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
            }

            return Results.Ok(await ToResponseAsync(db, cart.Id));
        });

        group.MapDelete("/", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = GetUserId(principal);
            if (userId is null) return Results.Unauthorized();

            var cart = await db.Carts
                .Include(entry => entry.Items)
                .FirstOrDefaultAsync(entry => entry.UserId == userId.Value);

            if (cart is not null)
            {
                db.CartItems.RemoveRange(cart.Items);
                cart.UpdatedAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
                return Results.Ok(await ToResponseAsync(db, cart.Id));
            }

            return Results.Ok(EmptyCart());
        });

        return group;
    }

    private static Guid? GetUserId(ClaimsPrincipal principal)
    {
        var raw = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub");
        return Guid.TryParse(raw, out var id) ? id : null;
    }

    private static async Task<Cart> GetOrCreateCartAsync(AppDbContext db, Guid userId)
    {
        var cart = await db.Carts.FirstOrDefaultAsync(entry => entry.UserId == userId);
        if (cart is not null) return cart;

        cart = new Cart { UserId = userId };
        db.Carts.Add(cart);
        await db.SaveChangesAsync();
        return cart;
    }

    private static async Task<CartResponse> ToResponseAsync(AppDbContext db, Guid cartId)
    {
        var items = await db.CartItems
            .AsNoTracking()
            .Where(item => item.CartId == cartId)
            .Include(item => item.Product)
            .OrderBy(item => item.ProductId)
            .ThenBy(item => item.Size)
            .Select(item => new CartItemDto(
                item.ProductId,
                item.Product!.Name,
                item.Product.Image,
                item.Product.Price,
                item.Size,
                item.Qty))
            .ToListAsync();

        return new CartResponse(
            items,
            items.Sum(item => item.Qty),
            items.Sum(item => item.Price * item.Qty));
    }

    private static CartResponse EmptyCart() => new([], 0, 0);
}
