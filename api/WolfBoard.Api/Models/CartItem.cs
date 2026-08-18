namespace WolfBoard.Api.Models;

public class CartItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CartId { get; set; }
    public int ProductId { get; set; }
    public string Size { get; set; } = string.Empty;
    public int Qty { get; set; }

    public Cart? Cart { get; set; }
    public Product? Product { get; set; }
}
