using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WolfBoard.Api.Data;
using WolfBoard.Api.Dtos;
using WolfBoard.Api.Services;

namespace WolfBoard.Api.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/login", async (
            [FromBody] LoginRequest request,
            AppDbContext db,
            TokenService tokens) =>
        {
            var email = request.Email.Trim().ToLowerInvariant();
            var user = await db.Users.FirstOrDefaultAsync(item => item.Email == email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Results.Json(
                    new { message = "Usuário ou senha inválidos." },
                    statusCode: StatusCodes.Status401Unauthorized);
            }

            var (token, expiresAt) = tokens.CreateToken(user);
            return Results.Ok(new AuthResponse(token, user.Email, expiresAt));
        });

        group.MapGet("/me", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue(ClaimTypes.Name)
                ?? principal.FindFirstValue("sub");

            if (!Guid.TryParse(userId, out var id))
            {
                return Results.Unauthorized();
            }

            var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
            return user is null
                ? Results.Unauthorized()
                : Results.Ok(new { user.Email, user.Id });
        }).RequireAuthorization();

        return group;
    }
}
