namespace project_backend.DTOs.Item
{
  public class ItemFilterDto
  {
    public int CollectionId { get; set; }
    public required Dictionary<string, string> CustomFieldFilters { get; set; }
  }
}
