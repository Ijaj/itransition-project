using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using project_backend.Data;

namespace project_backend.Models
{
    public class CustomFieldValue : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Value { get; set; }

        [Required]
        public int ItemId { get; set; }

        [ForeignKey("ItemId")]
        public required Item Item { get; set; }

        [Required]
        public int CustomFieldId { get; set; }

        [ForeignKey("CustomFieldId")]
        public required CustomField CustomField { get; set; }
    }
}
