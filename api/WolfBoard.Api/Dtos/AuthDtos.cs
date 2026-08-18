namespace WolfBoard.Api.Dtos;

public record LoginRequest(string Email, string Password);

public record AuthResponse(string Token, string Email, DateTime ExpiresAt);
