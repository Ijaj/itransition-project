using project_backend.Data;

namespace project_backend.Models
{
    public class Tag : BaseEntity
    {
        public int Id { get; set; }
        public required string Value { get; set; }
        public ICollection<Item>? Items { get; set; }
    }
}