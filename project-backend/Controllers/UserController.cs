using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using project_backend.DTOs.User;
using project_backend.Data;
using project_backend.Models;
using project_backend.Responses;
using System.Net;

namespace project_backend.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public UserController(AppDbContext context, IConfiguration configuration)
    {
      _context = context;
      _configuration = configuration;
    }

    // get all users
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetUsers()
    {
      List<User> allUsers = await _context.Users.ToListAsync();
      allUsers.ForEach((user) =>
      {
        user.PasswordHash = "";
      });
      return Ok(allUsers);
    }

    [Authorize]
    [HttpGet("{id}", Name = "GetUser")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
      var user = await _context.Users.FindAsync(id);

      if (user == null)
      {
        return NotFound(new NotFoundResponse("Could not find the specified user"));
      }

      return Ok(user);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<User>> UpdateUser(int id, [FromBody] UpdateDto updatedUser)
    {
      if (id != updatedUser.Id)
      {
        return BadRequest("ID mismatch");
      }

      User? user = await _context.Users.Where(x => x.Id == id).FirstOrDefaultAsync();

      if (user == null)
      {
        return NotFound("User not found");
      }

      // if passwordhash in req is empty, then take the old value
      user.Name = updatedUser.Name;
      user.Email = updatedUser.Email;
      user.Username = updatedUser.Username;
      user.Role = updatedUser.Role;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DBConcurrencyException e)
      {
        return BadRequest(e.Message);
      }

      return Ok(user);
    }

    [HttpPost]
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

      if (created)
      {
        string token = JWToken.GenerateJwtToken(user, _configuration);
        ResponseDto createResponse = new ResponseDto(user);
        return CreatedAtAction(nameof(CreateUser), new { id = user.Id }, createResponse);
      }
      else
      {
        return new ContentResult
        {
          StatusCode = (int)HttpStatusCode.InternalServerError,
          Content = "An error occurred while processing the request.",
          ContentType = "text/plain"
        };
      }

    }

    [HttpPost]
    public async Task<ActionResult<User>> Login([FromBody] LoginDto newUser)
    {
      User? user = await _context.Users.SingleOrDefaultAsync(x => x.Username == newUser.Username);

      if (user == null)
      {
        return NotFound(new { field = "username", message = "Username does not exists" });
      }

      bool match = BCrypt.Net.BCrypt.Verify(newUser.Password, user.PasswordHash);

      if (match)
      {
        string token = JWToken.GenerateJwtToken(user, _configuration);
        ResponseDto response = new ResponseDto(user, token);
        return Ok(response);
      }
      else
      {
        return BadRequest(new { field = "password", message = "Password didnt match" });
      }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
      User? user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        return NotFound();
      }

      _context.Users.Remove(user);
      try
      {
        await _context.SaveChangesAsync();
        return Ok();
      }
      catch (Exception)
      {

        throw;
      }
    }
  }
}
