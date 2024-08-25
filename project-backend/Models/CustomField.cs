using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using project_backend.Data;

namespace project_backend.Models
{
    public class CustomField : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public int CollectionId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Type { get; set; }

        public bool IsRequired { get; set; } = false;

        [ForeignKey("CollectionId")]
        public required Collection Collection { get; set; }

        public ICollection<CustomFieldValue>? CustomFieldValues { get; set; }

        public static CustomField Create(DTOs.CustomField.CustomFieldDto dto, Collection coll)
        {
            return new CustomField
            {
                Collection = coll,
                Name = dto.Name,
                Type = dto.Type,
                IsRequired = dto.IsRequired
            };
        }

        public static CustomField Update(DTOs.CustomField.CustomFieldDto dto, Collection coll)
        {
            return new CustomField
            {
                Id = dto.Id,
                Collection = coll,
                Name = dto.Name,
                Type = dto.Type,
                IsRequired = dto.IsRequired
            };
        }
    }
}