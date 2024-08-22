using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using project_backend.Data;

namespace project_backend.Models
{
    public class Item : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public required int CollectionId { get; set; }

        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public int Likes { get; set; }

        public virtual ICollection<ItemImage> Images { get; set; } = new List<ItemImage>();

        public virtual ICollection<CustomFieldValue> CustomFieldValues { get; set; } = new List<CustomFieldValue>();

        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();

        [ForeignKey("CollectionId")]
        public required Collection Collection { get; set; }

        [ForeignKey("UserId")]
        public required User User { get; set; }
    }

}
