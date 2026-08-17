namespace WolfBoard.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Image { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;

    public Category? Category { get; set; }
}
