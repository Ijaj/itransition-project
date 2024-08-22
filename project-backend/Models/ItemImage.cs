using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using project_backend.Data;

namespace project_backend.Models
{
    public class ItemImage : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public required int ItemId { get; set; }

        [Required]
        public required string Image { get; set; }

        [ForeignKey("ItemId")]
        public required Item Item { get; set; }
    }
}
