namespace project_backend.DTOs.CustomField
{
    public class CustomFieldDto
    {
        public int Id { get; set; } = 0;
        public int CollectionId { get; set; } = 0;
        public required string Name { get; set; }
        public required string Type { get; set; }
        public bool IsRequired { get; set; }
    }

    public class CollectionListDto
    {
        public required string Name { get; set; }
        public required string Type { get; set; }
        public bool IsRequired { get; set; } = false;
    }
}