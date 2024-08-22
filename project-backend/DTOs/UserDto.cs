using System.ComponentModel.DataAnnotations;
using project_backend.Models;

namespace project_backend.DTOs.User
{
    public class CreateDto
    {
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
        public required string Role { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "The new password must be at least 8 characters long.")]
        public required string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public required string ConfirmNewPassword { get; set; }
    }

    public class ResponseDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        public string Role { get; set; }

        public string? Token { get; set; }

        public ResponseDto(Models.User user, string? token = null)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            Username = user.Username;
            Role = user.Role;
            if(token != null) Token = token;
        }
    }

    public class UpdateDto
    {
        [Required]
        public required int Id { get; set; }

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
        public required string Role { get; set; }
    }

    public class PasswordChangeDto
    {
        [Required]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "The new password must be at least 8 characters long.")]
        public required string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public required string ConfirmNewPassword { get; set; }
    }

    public class LoginDto
    {
        [Required]
        [StringLength(100)]
        public required string Username { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "The new password must be at least 8 characters long.")]
        public required string Password { get; set; }
    }

}
