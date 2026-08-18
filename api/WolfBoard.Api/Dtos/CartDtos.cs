namespace WolfBoard.Api.Dtos;

public record CartItemDto(
    int ProductId,
    string Name,
    string Image,
    decimal Price,
    string Size,
    int Qty
);

public record CartResponse(
    IReadOnlyList<CartItemDto> Items,
    int ItemCount,
    decimal Total
);

public record UpsertCartItemRequest(int ProductId, string Size, int Qty);
