using System.ComponentModel.DataAnnotations;
namespace project_backend.DTOs.Collection
{
    public class CreateDto
    {
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int UserId { get; set; }

        public ICollection<Models.CustomField> CustomFields { get; set; } = new List<Models.CustomField>();
    }

    public class UpdateDto
    {
        [Required]
        public required int Id;

        [Required]
        [StringLength(100)]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        [Required]
        public required int CategoryId { get; set; }

        public ICollection<Models.CustomField> CustomFields { get; set; } = new List<Models.CustomField>();
    }

    public class ListDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required Category.CategoryDto Category { get; set; }
        public int ItemCount { get; set; }
        public List<CustomField.CollectionListDto>? CustomFields { get; set; }
    }
}
