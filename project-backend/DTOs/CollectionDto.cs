using System.ComponentModel.DataAnnotations;
using project_backend.DTOs.CustomField;
using project_backend.Models;
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

        public ICollection<CustomFieldDto> CustomFields { get; set; } = new List<CustomFieldDto>();
    }

    public class UpdateDto
    {
        [Required]
        public required int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        [Required]
        public required int CategoryId { get; set; }

        public ICollection<CustomFieldDto> CustomFields { get; set; } = new List<CustomFieldDto>();
    }

    public class ListDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required Category.CategoryDto Category { get; set; }
        public int ItemCount { get; set; }
        public string? Image { get; set; }
        public List<Models.CustomField>? CustomFields { get; set; }
    }

    public class FilterDto
    {
        public int Id;
        public string? Sort = "none";
        public int CategoryId = -1;
        public int ItemCountMin { get; set; } = -1;
        public int ItemCountMax { get; set; } = -1;
        public string? image = "both";
    }
}
