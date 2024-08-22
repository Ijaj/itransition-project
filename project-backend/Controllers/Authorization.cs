using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using project_backend.DTOs.User;
using project_backend.Data;
using project_backend.Models;

namespace project_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Auth : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public Auth(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> CreateUser([FromBody] CreateDto newUser)
        {
            bool email_exists = await _context.Users.AnyAsync(x => x.Email == newUser.Email);
            bool user_exists = await _context.Users.AnyAsync(x => x.Username == newUser.Username);

            if (email_exists)
            {
                return BadRequest(new { field = "email", message = "Email already exists" });
            }
            else if (user_exists)
            {
                return BadRequest(new { field = "username", message = "Username already exists" });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(newUser.NewPassword);
            User user = new User
            {
                Name = newUser.Name,
                Username = newUser.Username,
                Email = newUser.Email,
                PasswordHash = hashedPassword,
                Role = newUser.Role,
                RegistrationTime = DateTime.Now
            };

            _context.Users.Add(user);

            bool created = await _context.SaveChangesAsync() == 1;
            string token = JWToken.GenerateJwtToken(user, _configuration);
            ResponseDto res = new ResponseDto(user, token);

            return CreatedAtAction(
                actionName: nameof(UserController.GetUser),
                controllerName: nameof(UserController).Replace("Controller", ""),
                routeValues: new { id = user.Id },
                value: res
            );
        }

        [HttpPost("login")]
        public async Task<ActionResult> UpdateLastLogin(LoginDto loginData)
        {
            User? user = await _context.Users.SingleOrDefaultAsync(u => u.Username == loginData.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginData.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            string token = JWToken.GenerateJwtToken(user, _configuration);

            user.LastLoginTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ResponseDto(user, token));
        }
    }
}
