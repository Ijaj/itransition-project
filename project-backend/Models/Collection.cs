using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using project_backend.Data;

namespace project_backend.Models
{
  public class Collection : BaseEntity
  {
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; }

    public string? Description { get; set; }

    public string? Image { get; set; }

    public virtual ICollection<Item> Items { get; set; } = new List<Item>();

    public virtual ICollection<CustomField> CustomFields { get; set; } = new List<CustomField>();

    [Required]
    public int CategoryId { get; set; }

    [ForeignKey("CategoryId")]
    public required Category Category { get; set; }

    [Required]
    public required int UserId { get; set; }

    [ForeignKey("UserId")]
    public User? User { get; set; }
  }
}