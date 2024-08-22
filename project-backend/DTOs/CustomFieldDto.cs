namespace project_backend.DTOs.CustomField
{
    public class CustomFieldDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public bool IsRequired { get; set; }

        public CustomFieldDto(Models.CustomField field)
        {
            Name = field.Name;
            Type = field.Type;
            IsRequired = field.IsRequired;
        }
    }

    public class CollectionListDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Type { get; set; }
        public bool IsRequired { get; set; } = false;
    }
}