using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using project_backend.Data;

namespace project_backend.Models
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(Username), IsUnique = true)]
    public class User : BaseEntity
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public required string Email { get; set; }

        [Required]
        [StringLength(100)]
        public required string Username { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public required string Role { get; set; }

        public DateTime? LastLoginTime { get; set; }

        public DateTime? RegistrationTime { get; set; }

        public virtual ICollection<Collection> Collections { get; set; } = new List<Collection>();
        public virtual ICollection<Item> Items { get; set; } = new List<Item>();

    }
}
