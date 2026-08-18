namespace WolfBoard.Api.Dtos;

public record CategoryDto(string Slug, string Title, string Group);

public record ProductDto(
    int Id,
    string Name,
    decimal Price,
    string Image,
    string Category
);

public record ProductListResponse(IReadOnlyList<ProductDto> Items, int Total);
