namespace WolfBoard.Api.Models;

public class Category
{
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = [];
}
