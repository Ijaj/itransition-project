using System.ComponentModel.DataAnnotations;
using project_backend.Data;

namespace project_backend.Models
{
    public class Category : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        public ICollection<Collection> Collections { get; set; } = new List<Collection>();
    }
}
